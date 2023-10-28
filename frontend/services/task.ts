import type { TaskAPI } from '@api/task'
import axios from 'restyped-axios'

const client = axios.create<TaskAPI>({ baseURL: 'http://localhost:3000/' })

export async function getTasks() {
    return (
        await client.request({
            method: 'GET',
            url: '/api/tasks'
        })
    ).data
}

export async function postTask(name: string, done: boolean) {
    return (
        await client.request({
            method: 'POST',
            url: '/api/tasks',
            data: {
                name,
                done
            }
        })
    ).data
}
