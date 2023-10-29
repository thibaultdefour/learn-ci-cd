import { jwtDecode } from 'jwt-decode'
import { ref, computed, watchEffect } from 'vue'
import { login, register } from '@/services/auth.js'

const LOCALSTORAGE_KEY = 'token'

const _accessToken = ref<string | null>(null)

export const accessToken = computed(() => _accessToken.value)

export const currentUser = computed(() =>
    _accessToken.value ? jwtDecode(_accessToken.value) : null
)

export const isAuthenticated = computed(() => !!currentUser.value)

const storedToken = localStorage.getItem(LOCALSTORAGE_KEY)

if (storedToken) {
    _accessToken.value = storedToken
}

watchEffect(() => {
    if (_accessToken.value) {
        localStorage.setItem(LOCALSTORAGE_KEY, _accessToken.value)
    } else {
        localStorage.removeItem(LOCALSTORAGE_KEY)
    }
})

export async function signIn(email: string, password: string) {
    _accessToken.value = (await login(email, password)).access_token
}

export async function signOut() {
    _accessToken.value = null
}

export async function signUp(email: string, username: string, password: string) {
    _accessToken.value = (await register(email, username, password)).access_token
}
