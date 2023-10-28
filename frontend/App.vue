<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
    <VLayout class="vh100">
        <VMain class="d-flex align-center justify-center" style="min-height: 300px">
            <HelloWorld />
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
