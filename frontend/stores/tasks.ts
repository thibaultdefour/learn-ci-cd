import { ref, watchEffect } from 'vue'
import { getTasks, type Task, updateTask } from '@/services/task.js'
import { useAuthStore } from '@/stores/auth.js'

const { isAuthenticated } = useAuthStore()

const tasks = ref<Task[]>([])

watchEffect(() => {
    if (!isAuthenticated.value) {
        tasks.value = []
    }
})

const error = ref<unknown>(null)
const loading = ref(false)

async function retrieveTasks() {
    error.value = null
    loading.value = true

    try {
        tasks.value = await getTasks()
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
}

async function markTaskAsDone(taskId: string) {
    error.value = null
    loading.value = true
    try {
        await updateTask(taskId, { done: true })
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
    await retrieveTasks()
}
export function useTasksStore() {
    return {
        tasks,
        error,
        loading,
        retrieveTasks,
        markTaskAsDone
    }
}
