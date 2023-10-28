import type Task from '../orm/models/task.js'

export type { Task }
export interface TaskAPI {
    '/api/tasks': {
        GET: {
            response: Task[]
        }
        POST: {
            body: {
                name: Task['name']
                done: Task['done']
            }
            response: Task
        }
    }

    '/api/tasks/:taskId': {
        PATCH: {
            query: {
                taskId: string
            }
            body: {
                name?: string
                done?: boolean
            }
            response: Task
        }
        DELETE: {
            query: {
                taskId: string
            }
        }
    }
}
