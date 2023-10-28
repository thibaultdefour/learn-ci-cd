import express from 'express'
// import type RestypedRouter from 'restyped-express-async'
import { AsyncRouter } from './better.js'

// type TypedRouter<T> = ReturnType<typeof RestypedRouter<T>>

export function success(data: unknown) {
    return { data }
}

export function error(status: number, message: string) {
    return { status, error: message }
}

export function typeRouter<T>() {
    const router = express.Router()

    const typedRouter = AsyncRouter<T>(router)

    // let typedRouterEngine: TypedRouter<T>
    //
    // // ESM trick
    // if ('default' in RestypedRouter && typeof RestypedRouter.default === 'function') {
    //     typedRouterEngine = RestypedRouter.default(router) as TypedRouter<T>
    // } else {
    //     typedRouterEngine = RestypedRouter<T>(router)
    // }

    return { router, typedRouter }
}
