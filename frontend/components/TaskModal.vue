<script setup lang="ts">
import { computed, ref } from 'vue'
import { postTask } from '@/services/task.js'
import { useTasksStore } from '@/stores/tasks.js'

const { retrieveTasks, taskJustCreated } = useTasksStore()

const emit = defineEmits(['close'])

const title = ref('')

const error = ref<unknown>(null)
const loading = ref(false)

const isSubmittable = computed(() => !!title.value)

async function submit() {
    if (!isSubmittable.value) return

    loading.value = true
    error.value = null
    try {
        await postTask(title.value, false)

        retrieveTasks()

        taskJustCreated.value = true

        emit('close')
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <VCard title="Add a new task">
        <VSheet class="pa-5">
            <VAlert v-if="error" type="error" class="mb-5">
                {{ error }}
            </VAlert>

            <VTextField
                v-model="title"
                label="Task"
                variant="outlined"
                autofocus
                @keyup.enter="submit"
            />

            <VBtn
                :disabled="!isSubmittable"
                color="primary"
                type="submit"
                block
                class="mt-2"
                :loading="loading"
                @click="submit"
            >
                Submit
            </VBtn>
        </VSheet>
    </VCard>
</template>

<style scoped></style>
