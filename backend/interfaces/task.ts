import type { TaskInstance } from '../orm/models/task'

export interface TaskAPI {
    '/api/tasks': {
        GET: {
            response: TaskInstance[]
        }
        POST: {
            body: {
                username: string
                email: string
                password: string
            }
            response: {
                access_token: string
            }
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
            response: {
                access_token: string
            }
        }
        DELETE: {
            query: {
                taskId: string
            }
        }
    }
}
