import type { RequestHandler } from 'express'
import express, { type Router } from 'express'

export type ErrorFn = (status: number, message: string) => void

export interface TypedRouteInterface {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
    endpoint: string
    query?: Record<string, string>
    params?: Record<string, unknown>
    body?: Record<string, unknown>
    headers?: Record<string, string>
    middlewares?: RequestHandler[]

    handler(req: TypedReq<TypedRouteInterface>, error: ErrorFn): Promise<unknown>
}

export type TypedReq<T extends TypedRouteInterface> = {
    query: Partial<T['query']>
    params: Partial<T['params']>
    body: Partial<T['body']>
    headers: Partial<T['headers']>
}

type ToAPI<H extends TypedRouteInterface> = {
    query: H['query']
    params: H['params']
    body: H['body']
    headers: H['headers']
    response: Exclude<Awaited<ReturnType<H['handler']>>, void>
}
export class TypedRouter<O extends Record<string, never>> {
    private router: Router

    constructor(router?: Router) {
        this.router = router || express.Router()
    }
    route<R extends TypedRouteInterface>(route: R) {
        const expressMethods = {
            GET: this.router.get,
            POST: this.router.post,
            PUT: this.router.put,
            PATCH: this.router.patch,
            HEAD: this.router.head,
            OPTIONS: this.router.options,
            DELETE: this.router.delete
        }

        type Methods = keyof typeof expressMethods

        const expressMethod = expressMethods[route.method].bind(this.router)

        const routeHandler: RequestHandler = async (req, res) => {
            const error: ErrorFn = (status: number, message: string) => {
                if (!res.headersSent) {
                    res.status(status)
                    res.send({ error: message })
                }
            }

            const typedReq = {
                ...req,
                query: req.query as R['query'],
                params: req.params as R['params'],
                body: req.body as R['body'],
                headers: req.headers as R['headers']
            }

            try {
                const responseContent = await route.handler(typedReq, error)

                if (responseContent === undefined) {
                    return
                }

                const statuses: Record<Methods, number> = {
                    GET: 200,
                    POST: 201,
                    PUT: 201,
                    OPTIONS: 200,
                    HEAD: 200,
                    PATCH: 201,
                    DELETE: 204
                }

                const status = statuses[route.method]

                if (status) {
                    res.status(status)
                }

                res.send(responseContent)
            } catch (e) {
                console.error(e)
                res.status(500)
                res.send({ error: 'Internal server error', details: e })
            }
        }

        const middlewaresAndHandler = [...(route.middlewares || []), routeHandler]

        expressMethod(route.endpoint, ...middlewaresAndHandler)

        type Extended = O extends { [key in R['endpoint']]: unknown }
            ? O & {
                  [key in R['endpoint']]: O[R['endpoint']] & { [method in R['method']]: ToAPI<R> }
              }
            : O & {
                  [key in R['endpoint']]: { [method in R['method']]: ToAPI<R> }
              }

        return new TypedRouter<Extended>(this.router)
    }

    getApiTypeDefinition() {
        return null as unknown as O
    }

    getRouter() {
        return this.router
    }
}
