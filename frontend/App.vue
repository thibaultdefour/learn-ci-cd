<script setup lang="ts">
import { ref } from 'vue'
import UserAuthentication from '@/components/AuthenticationForm.vue'
import UserTasks from '@/components/TaskList.vue'
import TaskModal from '@/components/TaskModal.vue'
import { useAuthStore } from '@/stores/auth.js'

const { isAuthenticated } = useAuthStore()

const taskModalOpen = ref(false)
</script>

<template>
    <VDialog v-model="taskModalOpen" width="500">
        <TaskModal @close="taskModalOpen = false" />
    </VDialog>

    <VLayout class="vh100">
        <VMain class="d-flex flex-column align-center justify-center">
            <UserAuthentication v-if="!isAuthenticated" />
            <UserTasks v-else />
        </VMain>
    </VLayout>
    <VLayout v-if="isAuthenticated" class="footer">
        <VBtn
            color="primary"
            title="Add a new task"
            icon="mdi-plus"
            size="large"
            @click="taskModalOpen = true"
        />
    </VLayout>
</template>

<style scoped>
html,
body,
#app,
.vh100 {
    min-height: 100vh;
    padding: 40px;
}

.footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
</style>
