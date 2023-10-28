import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../consts/secret.js'
import { usePrisma } from '../orm/database.js'
import type { ErrorFn, TypedReq, TypedRouteInterface } from './helpers/typed-router.js'
import { TypedRouter } from './helpers/typed-router.js'

const prisma = usePrisma()

const typedRouter = new TypedRouter()
    .route(
        new (class AuthRegisterRoute implements TypedRouteInterface {
            method = 'POST' as const
            endpoint = '/api/auth/register' as const

            declare body: {
                username: string
                email: string
                password: string
            }

            async handler(req: TypedReq<AuthRegisterRoute>, error: ErrorFn) {
                try {
                    const { username, email, password } = req.body

                    if (typeof username !== 'string') throw new Error('')
                    if (typeof email !== 'string') throw new Error('')
                    if (typeof password !== 'string') throw new Error('')

                    // Vérifier si l'utilisateur existe déjà
                    const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

                    if (userWithSameEmail) {
                        return error(409, 'E-mail already used')
                    }

                    // Vérifier si l'utilisateur existe déjà
                    const userWithSameUsername = await prisma.user.findFirst({
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            admin: true
                        },
                        where: { username }
                    })

                    if (userWithSameUsername) {
                        return error(409, 'Username already used')
                    }

                    // Créer le nouvel utilisateur
                    const newUser = await prisma.user.create({
                        data: {
                            username,
                            email,
                            password,
                            admin: false
                        }
                    })

                    // Générer un token JWT pour l'authentification future
                    const payload = {
                        id: newUser.id,
                        username,
                        email,
                        admin: email.endsWith('@admin.org')
                    }
                    const access_token = jwt.sign(payload, JWT_SECRET)

                    return { access_token }
                } catch (e) {
                    return error(400, 'Invalid or missing information')
                }
            }
        })()
    )
    .route(
        new (class AuthLoginRoute implements TypedRouteInterface {
            method = 'POST' as const
            endpoint = '/api/auth/login' as const

            declare body: { email: string; password: string }

            async handler(req: TypedReq<AuthLoginRoute>, error: ErrorFn) {
                const { email, password } = req.body

                try {
                    // Vérifier si l'utilisateur existe
                    const user = await prisma.user.findFirst({
                        where: { email }
                    })

                    if (user === null) {
                        return error(401, 'Invalid credentials')
                    }

                    // Vérifier le mot de passe de l'utilisateur
                    if (user.password !== password) {
                        return error(401, 'Invalid credentials.')
                    }

                    // Générer un token JWT pour l'authentification future
                    const payload = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        admin: user.admin
                    }
                    const token = jwt.sign(payload, JWT_SECRET)

                    // Renvoyer le token
                    return { access_token: token }
                } catch (e) {
                    error(500, 'Invalid credentials')
                }
            }
        })()
    )

export type AuthAPI = ReturnType<typeof typedRouter.getApiTypeDefinition>
export default typedRouter.getRouter()
