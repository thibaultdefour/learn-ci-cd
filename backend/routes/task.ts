import type { TaskAPI } from '../interfaces/task'
import { Task } from '../orm/models/task.js'
import { typeRouter } from './helpers/router.js'

const { router, typedRouter } = typeRouter<TaskAPI>()

typedRouter.get('/api/tasks', async (req, error) => {
    const tasks = await Task.findAll()
    return tasks
    return error(404, 'Not found')
    // return success(tasks)
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
