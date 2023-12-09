<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const { signIn, signUp } = useAuthStore()

const mode = ref<'Sign-in' | 'Sign-up'>('Sign-up')

const username = ref('')
const password = ref('')
const email = ref('')

const error = ref<unknown>(null)
const loading = ref(false)

const invalidPasswordMessage = computed(() => {
    if (mode.value !== 'Sign-up') return ''

    if (!password.value) return 'Password is required'

    return ''
})

const isSubmittable = computed(() => {
    if (!email.value || !password.value) {
        return false
    }

    if (mode.value === 'Sign-up' && !username.value) {
        return false
    }

    if (invalidPasswordMessage.value) {
        return false
    }

    return true
})

async function submit() {
    if (!isSubmittable.value) return

    loading.value = true
    error.value = null
    try {
        if (mode.value === 'Sign-up') {
            await signUp(email.value, username.value, password.value)
        } else {
            await signIn(email.value, password.value)
        }
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="d-flex flex-1-1 align-center justify-center">
        <VCard :title="mode" variant="elevated">
            <VSheet width="300" class="pa-5">
                <VAlert v-if="error" type="error" class="mb-5">
                    {{ error }}
                </VAlert>

                <VTextField
                    v-model="email"
                    label="E-Mail"
                    variant="outlined"
                    autofocus
                    @keyup.enter="submit"
                />
                <VTextField
                    v-if="mode === 'Sign-up'"
                    v-model="username"
                    label="Username"
                    variant="outlined"
                    @keyup.enter="submit"
                />
                <VTextField
                    v-model="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    :error-messages="invalidPasswordMessage"
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
    </div>
    <VBtn class="ma-5" variant="flat" @click="mode = mode === 'Sign-in' ? 'Sign-up' : 'Sign-in'">
        {{ mode === 'Sign-in' ? 'Sign-up ?' : 'Sign-in ?' }}
    </VBtn>
</template>

<style scoped></style>
