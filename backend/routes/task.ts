import type { AuthReq } from '../middlewares/auth.js'
import authMiddleware from '../middlewares/auth.js'
import { usePrisma } from '../orm/database.js'
import type { ErrorFn, TypedRouteInterface, TypedReq } from './helpers/typed-router.js'
import { TypedRouter } from './helpers/typed-router.js'

const prisma = usePrisma()

const typedRouter = new TypedRouter()
    .route(
        new (class GetTasksRoute implements TypedRouteInterface {
            method = 'GET' as const
            endpoint = '/api/tasks' as const

            middlewares = [authMiddleware]

            async handler() {
                return prisma.task.findMany({
                    include: {
                        collection: {
                            include: {
                                owner: true
                            }
                        }
                    }
                })
            }
        })()
    )
    .route(
        new (class PutTasksRoute implements TypedRouteInterface {
            method = 'PATCH' as const
            endpoint = '/api/tasks/:taskId' as const

            declare query: { tasksId: string }
            declare body: { name: string; done: boolean }

            middlewares = [authMiddleware]

            async handler(req: AuthReq<TypedReq<PutTasksRoute>>, error: ErrorFn) {
                if (!req.query.tasksId) {
                    return error(400, 'Bad request')
                }

                const task = await prisma.task.findFirst({
                    where: { id: req.query.tasksId }
                })

                if (!task) {
                    return error(404, 'Not found')
                }

                const collection = await prisma.collection.findFirst({
                    where: {
                        id: task.collectionId,
                        ownerId: req.user.id
                    }
                })

                if (!collection) {
                    return error(403, 'Not authorized')
                }

                if (req.body.name) {
                    task.name = req.body.name
                }

                if (req.body.done) {
                    task.done = req.body.done
                }

                await prisma.task.update({
                    where: {
                        id: task.id
                    },
                    data: task
                })
            }
        })()
    )
    .route(
        new (class PostTasksRoute implements TypedRouteInterface {
            method = 'POST' as const
            endpoint = '/api/tasks' as const

            declare body: { name: string; done: boolean }

            middlewares = [authMiddleware]

            async handler(req: AuthReq<TypedReq<PostTasksRoute>>) {
                const collection = await prisma.collection.create({
                    data: {
                        name: 'My default collection',
                        ownerId: req.user.id
                    }
                })

                const task = await prisma.task.create({
                    data: {
                        name: req.body.name || '',
                        done: req.body.done || false,
                        collectionId: collection.id
                    }
                })

                return task
            }
        })()
    )

export type TaskAPI = ReturnType<typeof typedRouter.getApiTypeDefinition>
export default typedRouter.getRouter()
