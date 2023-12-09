<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.js'
import { useTasksStore } from '@/stores/tasks.js'

const { tasks, retrieveTasks, markTaskAsDone, error, loading } = useTasksStore()

const { signOut, isAuthenticated } = useAuthStore()

retrieveTasks()
</script>

<template>
    <div v-if="!tasks.length" class="d-flex flex-1-1 align-center justify-center">
        <b>You have no task for now !</b>
    </div>

    <div v-else class="d-flex flex-1-1 flex-column align-center justify-center">
        <VCard>
            <VAlert v-if="error" type="error" class="mb-5">
                {{ error }}
            </VAlert>

            <VProgressLinear :style="{ opacity: loading ? 1 : 0 }" indeterminate />

            <VTable class="table">
                <tbody>
                    <tr v-for="task in tasks" :key="task.id">
                        <td :style="{ textDecoration: task.done ? 'line-through' : '' }">
                            {{ task.name }}
                        </td>
                        <td class="actions">
                            <VBtn
                                v-if="!task.done"
                                prepend-icon="mdi-check-circle"
                                variant="flat"
                                @click="markTaskAsDone(task.id)"
                            >
                                Mark as done
                                <template #prepend>
                                    <VIcon color="success" />
                                </template>
                            </VBtn>
                        </td>
                    </tr>
                </tbody>
            </VTable>
        </VCard>
    </div>
    <VBtn v-if="isAuthenticated" class="ma-5" variant="flat" @click="signOut"> Sign-out </VBtn>
</template>

<style scoped>
.table {
    min-width: 500px;
}

.actions {
    width: 150px;
}
</style>
