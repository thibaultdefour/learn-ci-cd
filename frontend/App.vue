<script setup lang="ts">
import UserAuthentication from '@/components/UserAuthentication.vue'
import UserTasks from '@/components/UserTasks.vue'
import { isAuthenticated } from '@/stores/auth.js'
</script>

<template>
    <VLayout class="vh100">
        <VMain class="d-flex flex-column align-center justify-center">
            <UserAuthentication v-if="!isAuthenticated" />
            <UserTasks v-else />
        </VMain>
    </VLayout>
</template>

<style scoped>
html,
body,
#app,
.vh100 {
    min-height: 100vh;
}
</style>
