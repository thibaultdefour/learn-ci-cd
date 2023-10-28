<script setup lang="ts">
import type { TaskInstance } from '@api/task'
import { ref } from 'vue'
import { getTasks } from '@/services/task.js'

const tasks = ref<TaskInstance[]>([])

async function loadTasks() {
    tasks.value = await getTasks()
}

loadTasks()
</script>

<template>{{ tasks }}</template>

<style scoped></style>
