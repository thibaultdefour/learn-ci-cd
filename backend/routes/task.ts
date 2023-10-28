import { usePrisma } from '../orm/database.js'
import type { ErrorFn, TypedRouteInterface, TypedReq } from './helpers/typed-router.js'
import { TypedRouter } from './helpers/typed-router.js'

const prisma = usePrisma()

const typedRouter = new TypedRouter()
    .route(
        new (class GetTasksRoute implements TypedRouteInterface {
            method = 'GET' as const
            endpoint = '/api/tasks' as const

            async handler(req: TypedReq<GetTasksRoute>, error: ErrorFn) {
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
            method = 'PUT' as const
            endpoint = '/api/tasks' as const

            declare query: { tasksId: string }
            declare params: { readableLink: boolean }
            declare body: { business: { name: string } }
            declare headers: { Authorization: 'Token ABC' }

            async handler(req: TypedReq<PutTasksRoute>, error: ErrorFn) {
                // return [] as Business[]
            }
        })()
    )
    .route(
        new (class PostTasksRoute implements TypedRouteInterface {
            method = 'POST' as const
            endpoint = '/api/tasks' as const

            declare body: { name: string; done: boolean }

            async handler(req: TypedReq<PostTasksRoute>, error: ErrorFn) {
                const collection = await prisma.collection.create({
                    data: {
                        name: 'My default collection',
                        ownerId: '' // req.user.id
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
