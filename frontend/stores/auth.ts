import { jwtDecode } from 'jwt-decode'
import { ref, computed, watchEffect } from 'vue'
import { login, register } from '@/services/auth.js'

const LOCALSTORAGE_KEY = 'token'

const _accessToken = ref<string | null>(null)

const accessToken = computed(() => _accessToken.value)

const currentUser = computed(() => (_accessToken.value ? jwtDecode(_accessToken.value) : null))

const isAuthenticated = computed(() => !!currentUser.value)

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

async function signIn(email: string, password: string) {
    _accessToken.value = (await login(email, password)).access_token
}

async function signOut() {
    _accessToken.value = null
}

async function signUp(email: string, username: string, password: string) {
    _accessToken.value = (await register(email, username, password)).access_token
}

export function useAuthStore() {
    return {
        accessToken,
        currentUser,
        isAuthenticated,
        signIn,
        signUp,
        signOut
    }
}
