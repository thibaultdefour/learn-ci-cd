import { useAuthStore } from '@/stores/auth.js'

const { accessToken } = useAuthStore()
export function getAuthHeader() {
    return {
        Authorization: 'Token ' + accessToken.value
    }
}
