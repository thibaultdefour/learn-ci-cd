export interface AuthAPI {
    '/api/auth/register': {
        POST: {
            body: {
                username: string
                email: string
                password: string
            }
            response: {
                access_token: string
            }
        }
    }

    '/api/auth/login': {
        POST: {
            body: {
                email: string
                password: string
            }
            response: {
                access_token: string
            }
        }
    }
}
