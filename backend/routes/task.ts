import type { TaskAPI } from '../interfaces/task'
import Collection from '../orm/models/collection.js'
import Task from '../orm/models/task.js'
import { useTypedRouter } from './helpers/router.js'

const { router, typedRouter } = useTypedRouter<TaskAPI>()

type ErrorFn = () => void
//
type Business = { id: number; foo: string }

// type Req<
//     T extends {
//         query?: Partial<Record<string, string>>
//         params?: Partial<Record<string, unknown>>
//         body?: Partial<Record<string, unknown>>
//         headers?: Partial<Record<string, string>>
//     }
// > = T
//
// type Resp<T> = T | void

// type Input = {
//     query?: Record<string, string>
//     params?: Partial<Record<string, unknown>>
//     body?: Partial<Record<string, unknown>>
//     headers?: Partial<Record<string, string>>
// }

//
// type AsRealInput<I extends Input> = {
//     query: Partialx<I['query']>
// }

// type Handler<I extends Input, O> = (req: AsRealInput<I>, error: ErrorFn) => O

type Reflex<T extends HandlerInterface> = {
    endpoint: T['endpoint']
    query: Partial<T['query']>
    params: Partial<T['params']>
    body: Partial<T['body']>
    headers: Partial<T['headers']>
}

interface HandlerInterface {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
    endpoint: string
    query?: Record<string, string>
    params?: Record<string, unknown>
    body?: Record<string, unknown>
    headers?: Record<string, string>

    handler(req: Reflex<HandlerInterface>, error: ErrorFn): void
}
class GetTasksHandler implements HandlerInterface {
    declare method: 'GET'
    declare endpoint: '/api/tasks'

    declare query: { tasksId: string }
    declare params: { readableLink: boolean }
    declare body: { business: { name: string } }
    declare headers: { Authorization: 'Token ABC' }

    handler(req: Reflex<GetTasksHandler>, error: ErrorFn) {
        // return [] as Business[]
    }
}

class PutTasksHandler implements HandlerInterface {
    declare method: 'PUT'
    declare endpoint: '/api/tasks'

    declare query: { tasksId: string }
    declare params: { readableLink: boolean }
    declare body: { business: { name: string } }
    declare headers: { Authorization: 'Token ABC' }

    handler(req: Reflex<GetTasksHandler>, error: ErrorFn) {
        // return [] as Business[]
    }
}

type Res = ReturnType<GetTasksHandler['handler']>

type ToAPI<H extends HandlerInterface> = {
    query: H['query']
    params: H['params']
    body: H['body']
    headers: H['headers']
    response: Exclude<ReturnType<H['handler']>, void>
}

const routes = {}

class Builder<Z = {}> {
    static add<O extends Record<string, unknown>, H extends HandlerInterface>(
        routes: O,
        handler: H
    ) {
        type Extended = O extends { [key in H['endpoint']]: unknown }
            ? O & {
                  [key in H['endpoint']]: O[H['endpoint']] & { [method in H['method']]: ToAPI<H> }
              }
            : O & {
                  [key in H['endpoint']]: { [method in H['method']]: ToAPI<H> }
              }

        return routes as Extended
    }
}

const routes2 = Builder.add(routes, new GetTasksHandler())
const routes3 = Builder.add(routes2, new PutTasksHandler())

type API = {
    '/api/tasks': {
        GET: ToAPI<GetTasksHandler>
    }
}

// const x: API

// const y = x["/api/tasks"].GET.response

// console.log(GetTasksHandler)
// const getTasks: Handler = (
//     req: AsRealInput<{
//         query: { tasksId: string }
//         params: { readableLink: boolean }
//         body: { business: { name: string } }
//         headers: { Authorization: 'Token ABC' }
//     }>,
//     error
// ) => {
//     if (!Date.now()) {
//         return error()
//     }
//
//     console.log(req.query.tasksId)
//
//     return [] as Business[]
//
//     return void
// }

typedRouter.get('/api/tasks', async (req, error) => {
    const tasks = await Task.findAll({ include: [{ model: Collection, as: 'collection' }] })

    return tasks
})
typedRouter.post('/api/tasks', async (req) => {
    const task = await Task.create({
        name: req.body.name,
        done: req.body.done,
        ownerId: '' // req.user.id
    })

    return task
})

typedRouter.post('/api/tasks', async (req) => {
    const task = await Task.create({
        name: req.body.name,
        done: req.body.done,
        ownerId: '' // req.user.id
    })

    return task
})

typedRouter.patch('/api/tasks/:taskId', async (req) => {
    const task = await Task.findByPk(req.query.taskId)

    if (!task) {
        throw { error: 'Not found' }
    }

    if (req.body.name) {
        task.name = req.body.name
    }

    if (req.body.done) {
        task.done = req.body.done
    }

    await task.save()

    return task
})

typedRouter.delete('/api/tasks/:taskId', async () => {})

export default router
