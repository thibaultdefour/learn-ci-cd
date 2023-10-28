<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
    <VLayout>
        <VMain class="d-flex align-center justify-center" style="min-height: 300px">
            <HelloWorld />
        </VMain>
    </VLayout>
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
