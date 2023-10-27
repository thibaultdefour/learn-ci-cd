import type { TaskAPI } from '../interfaces/task'
import authMiddleware from '../middlewares/auth.js'
import { Task } from '../orm/models/task.js'
import { typeRouter } from './helpers/router.js'

const { router, typedRouter } = typeRouter<TaskAPI>()

typedRouter.get('/api/tasks', async () => {
    const tasks = await Task.findAll()

    return tasks
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

typedRouter.use(authMiddleware).post('/api/tasks', () => {})

typedRouter.use(authMiddleware).patch('/api/tasks/:taskId', async () => {})

typedRouter.use(authMiddleware).delete('/api/tasks/:taskId', async () => {})

export default router
