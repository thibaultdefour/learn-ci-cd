<script setup lang="ts">
import { ref } from 'vue'
import type { ServiceReturn } from '@/services/helper/typing.js'
import { getTasks } from '@/services/task.js'

type Task = ServiceReturn<typeof getTasks>[0]

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
                    <td>{{ task.collection.owner.username }}</td>
                    <td>{{ task.id }}</td>
                </tr>
            </tbody>
        </VTable>
    </VCard>
</template>

<style scoped></style>
