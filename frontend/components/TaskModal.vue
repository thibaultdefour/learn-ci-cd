<script setup lang="ts">
import { computed, ref } from 'vue'
import { postTask } from '@/services/task.js'
import { useTasksStore } from '@/stores/tasks.js'

const { retrieveTasks } = useTasksStore()

const emit = defineEmits(['close'])

const title = ref('')

const error = ref<unknown>(null)
const loading = ref(false)

const isSubmittable = computed(() => !!title.value)

const done = ref(false)

const progressToQuit = ref(0)
async function submit() {
    if (!isSubmittable.value) return

    loading.value = true
    error.value = null
    try {
        await postTask(title.value, false)

        retrieveTasks()

        done.value = true

        progressToQuit.value = 0

        const step = 5
        const duration = 2000
        const period = duration / (100 / step)

        const interval = setInterval(() => {
            progressToQuit.value += step
            if (progressToQuit.value >= 100) {
                clearInterval(interval)
                emit('close')
            }
        }, period)
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

            <VAlert v-if="done" type="success">
                You task have been created successfully!
                <VProgressLinear v-model="progressToQuit" color="white" />
            </VAlert>

            <template v-if="!done">
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
            </template>
        </VSheet>
    </VCard>
</template>

<style scoped></style>
