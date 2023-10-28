import express, { type Router } from 'express'

export type ErrorFn = (status: number, message: string) => void

export type TypedReq<T extends HandlerInterface> = {
    query: Partial<T['query']>
    params: Partial<T['params']>
    body: Partial<T['body']>
    headers: Partial<T['headers']>
}

type ToAPI<H extends HandlerInterface> = {
    query: H['query']
    params: H['params']
    body: H['body']
    headers: H['headers']
    response: Exclude<ReturnType<H['handler']>, void>
}

export interface HandlerInterface {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
    endpoint: string
    query?: Record<string, string>
    params?: Record<string, unknown>
    body?: Record<string, unknown>
    headers?: Record<string, string>

    handler(req: TypedReq<HandlerInterface>, error: ErrorFn): unknown
}

export class TypedRouter<O extends Record<string, never>> {
    private router: Router

    constructor(router?: Router) {
        this.router = router || express.Router()
    }
    route<H extends HandlerInterface>(handler: H) {
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

        const route = expressMethods[handler.method].bind(this.router)

        route(handler.endpoint, async (req, res) => {
            const error: ErrorFn = (status: number, message: string) => {
                if (!res.headersSent) {
                    res.status(status)
                    res.send({ error: message })
                }
            }

            const safeReq = {
                query: req.query as H['query'],
                params: req.params as H['params'],
                body: req.body as H['body'],
                headers: req.headers as H['headers']
            }

            try {
                const responseContent = await handler.handler(safeReq, error)

                if (responseContent === undefined) {
                    res.status(500)
                    return res.send({ error: 'Internal server error' })
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

                const status = statuses[handler.method]

                if (status) {
                    res.status(status)
                }

                res.send(responseContent)
            } catch (e) {
                console.error(e)
                res.status(500)
                res.send({ error: 'Internal server error', details: e })
            }
        })

        type Extended = O extends { [key in H['endpoint']]: unknown }
            ? O & {
                  [key in H['endpoint']]: O[H['endpoint']] & { [method in H['method']]: ToAPI<H> }
              }
            : O & {
                  [key in H['endpoint']]: { [method in H['method']]: ToAPI<H> }
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
