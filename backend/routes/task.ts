import type { ErrorFn, HandlerInterface, TypedReq } from './helpers/typed-router.js'
import { TypedRouter } from './helpers/typed-router.js'

type Business = { id: number; foo: string }

class GetTasksHandler implements HandlerInterface {
    declare method: 'GET'
    declare endpoint: '/api/tasks'

    declare query: { tasksId: string }
    declare params: { readableLink: boolean }
    declare body: { business: { name: string } }
    declare headers: { Authorization: 'Token ABC' }

    handler(req: TypedReq<GetTasksHandler>, error: ErrorFn) {
        return [] as Business[]
    }
}

class PutTasksHandler implements HandlerInterface {
    declare method: 'PUT'
    declare endpoint: '/api/tasks'

    declare query: { tasksId: string }
    declare params: { readableLink: boolean }
    declare body: { business: { name: string } }
    declare headers: { Authorization: 'Token ABC' }

    handler(req: TypedReq<PutTasksHandler>, error: ErrorFn) {
        // return [] as Business[]
    }
}

class PostTasksHandler implements HandlerInterface {
    declare method: 'POST'
    declare endpoint: '/api/tasks'

    declare query: { tasksId: string }
    declare params: { readableLink: boolean }
    declare body: { business: { name: string } }
    declare headers: { Authorization: 'Token ABC' }

    handler(req: TypedReq<GetTasksHandler>, error: ErrorFn) {
        return [] as Business[]
    }
}

const typedRouter = new TypedRouter()
    .route(new GetTasksHandler())
    .route(new PutTasksHandler())
    .route(new PostTasksHandler())
// const routes3 = typedRouter.add(new PutTasksHandler(), routes2).extended

export type TaskAPI = ReturnType<typeof typedRouter.getApiTypeDefinition>
export const route = typedRouter.getRouter()

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
//
// typedRouter.get('/api/tasks', async (req, error) => {
//     const tasks = await Task.findAll({ include: [{ model: Collection, as: 'collection' }] })
//
//     return tasks
// })
// typedRouter.post('/api/tasks', async (req) => {
//     const task = await Task.create({
//         name: req.body.name,
//         done: req.body.done,
//         ownerId: '' // req.user.id
//     })
//
//     return task
// })
//
// typedRouter.post('/api/tasks', async (req) => {
//     const task = await Task.create({
//         name: req.body.name,
//         done: req.body.done,
//         ownerId: '' // req.user.id
//     })
//
//     return task
// })
//
// typedRouter.patch('/api/tasks/:taskId', async (req) => {
//     const task = await Task.findByPk(req.query.taskId)
//
//     if (!task) {
//         throw { error: 'Not found' }
//     }
//
//     if (req.body.name) {
//         task.name = req.body.name
//     }
//
//     if (req.body.done) {
//         task.done = req.body.done
//     }
//
//     await task.save()
//
//     return task
// })
//
// typedRouter.delete('/api/tasks/:taskId', async () => {})
//
// export default router
