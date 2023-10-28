<script setup lang="ts">
import type { Task } from '@api/task'
import { ref } from 'vue'
import { getTasks } from '@/services/task.js'

const tasks = ref<Task[]>([])

async function loadTasks() {
    tasks.value = await getTasks()
}

loadTasks()
</script>

<template>
    <VCard>
        <VTable>
            <thead>
                <tr>
                    <th class="text-left">Tâche</th>
                    <th class="text-left">Utilisateur</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.id">
                    <td>{{ task.name }}</td>
                    <td>{{ task.owner.username }}</td>
                    <td>{{ task.id }}</td>
                </tr>
            </tbody>
        </VTable>
    </VCard>
</template>

<style scoped></style>
