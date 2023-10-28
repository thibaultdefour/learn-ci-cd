import type { TaskInstance } from '../orm/models/task'

export type { TaskInstance }

export interface TaskAPI {
    '/api/tasks': {
        GET: {
            response: TaskInstance[]
        }
        POST: {
            body: {
                name: TaskInstance['name']
                done: TaskInstance['done']
            }
            response: TaskInstance
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
            response: TaskInstance
        }
        DELETE: {
            query: {
                taskId: string
            }
        }
    }
}
