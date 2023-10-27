import type { Router } from 'express'
import express from 'express'
import RestypedRouter from 'restyped-express-async'

type TypedRouter<T> = ReturnType<typeof RestypedRouter<T>>

export function typeRouter<T>(): { router: Router; typedRouter: TypedRouter<T> } {
    const router = express.Router()

    // ESM trick
    if ('default' in RestypedRouter && typeof RestypedRouter.default === 'function') {
        const typedRouter = RestypedRouter.default(router) as TypedRouter<T>
        return { router, typedRouter }
    }

    const typedRouter = RestypedRouter<T>(router)

    return { router, typedRouter }
}
