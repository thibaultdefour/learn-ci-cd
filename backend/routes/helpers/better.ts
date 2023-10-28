import type { Express, Router, Request, Response } from 'express'
import type { RestypedBase, RestypedRoute } from 'restyped'
export interface TypedRequest<T extends RestypedRoute> extends Request {
    body: T['body']
    params: T['params']
    query: T['query']
}

export function AsyncRouter<APIDef extends RestypedBase>(app: Express | Router) {
    type MethodEnum = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS'

    type Handler<Path extends keyof APIDef, Method extends MethodEnum> = (
        req: TypedRequest<APIDef[Path][Method]>,
        error: (status: number, message: string) => void
    ) => Promise<APIDef[Path][Method]['response'] | void>

    const createAsyncRoute = function <Path extends keyof APIDef, Method extends MethodEnum>(
        path: Path,
        method: Method,
        handler: Handler<Path, Method>
    ) {
        const route = app[method.toLowerCase()].bind(app)
        route(path, function (req: TypedRequest<APIDef[Path][Method]>, res: Response) {
            function error(status: number, message: string): void {
                if (!res.headersSent) {
                    res.status(status)
                    res.send({ error: message })
                }
            }

            return handler(req, error)
                .then((result) => {
                    if (!res.headersSent) {
                        if (result === undefined) {
                            res.status(500)
                            res.send({ error: 'Internal server error' })
                        } else {
                            const statuses: Record<MethodEnum, number> = {
                                GET: 200,
                                POST: 201,
                                PUT: 201,
                                OPTIONS: 200,
                                HEAD: 200,
                                PATCH: 201,
                                DELETE: 204
                            }

                            const status = statuses[req.method]

                            if (status) {
                                res.status(status)
                            }

                            res.send(result)
                        }
                    }
                })
                .catch((err) => {
                    res.status(500)
                    res.send({ error: 'Internal server error' })
                })
        })
    }
    return {
        route: createAsyncRoute,
        use: app.use.bind(app),
        get: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['GET']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['GET']['response'] | void>
        ) {
            return createAsyncRoute(path, 'GET', handler)
        },
        post: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['POST']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['POST']['response']>
        ) {
            return createAsyncRoute(path, 'POST', handler)
        },
        put: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['PUT']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['PUT']['response']>
        ) {
            return createAsyncRoute(path, 'PUT', handler)
        },
        delete: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['DELETE']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['DELETE']['response']>
        ) {
            return createAsyncRoute(path, 'DELETE', handler)
        },
        patch: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['PATCH']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['PATCH']['response']>
        ) {
            return createAsyncRoute(path, 'PATCH', handler)
        },
        options: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['OPTIONS']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['OPTIONS']['response']>
        ) {
            return createAsyncRoute(path, 'OPTIONS', handler)
        },
        head: function <Path extends keyof APIDef>(
            path: Path,
            handler: (
                req: TypedRequest<APIDef[Path]['HEAD']>,
                error: (status: number, message: string) => void
            ) => Promise<APIDef[Path]['HEAD']['response']>
        ) {
            return createAsyncRoute(path, 'HEAD', handler)
        }
    }
}
