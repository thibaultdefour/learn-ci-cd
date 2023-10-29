import { accessToken } from '@/stores/auth.js'

export function getAuthHeader() {
    return {
        Authorization: 'Token ' + accessToken.value
    }
}
