import jwtDecode from 'jwt-decode'
import { ref, computed, watchEffect } from 'vue'
import { login, register } from '@/services/auth.js'

const LOCALSTORAGE_KEY = 'token'

const accessToken = ref<string | null>(null)

export const currentUser = computed(() => jwtDecode(accessToken.value))

const storedToken = localStorage.getItem(LOCALSTORAGE_KEY)

if (storedToken) {
    accessToken.value = storedToken
}

watchEffect(() => {
    if (accessToken.value) {
        localStorage.setItem(LOCALSTORAGE_KEY, accessToken.value)
    } else {
        localStorage.removeItem(LOCALSTORAGE_KEY)
    }
})

export async function signIn(email: string, password: string) {
    accessToken.value = (await login(email, password)).access_token
}

export async function signOut() {
    accessToken.value = null
}

export async function signUp(email: string, username: string, password: string) {
    accessToken.value = (await register(email, username, password)).access_token
}
