import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../consts/secret.js'
import type { AuthAPI } from '../interfaces/auth.js'
// import User from '../orm/models/user.js'
import { usePrisma } from '../orm/database.js'
import { useTypedRouter } from './helpers/router.js'

const prisma = usePrisma()

const { router, typedRouter } = useTypedRouter<AuthAPI>()

// Endpoint pour la création d'un nouvel utilisateur
typedRouter.post('/api/auth/register', async (req) => {
    try {
        const { username, email, password } = req.body

        if (typeof username !== 'string') throw new Error('')
        if (typeof email !== 'string') throw new Error('')
        if (typeof password !== 'string') throw new Error('')

        // Vérifier si l'utilisateur existe déjà
        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if (userWithSameEmail) {
            throw { error: 'E-mail already used' }
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
            throw { error: 'Username already used' }
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
        throw { error: 'Invalid or missing information', details: e }
    }
})

// Endpoint pour l'authentification d'un utilisateur enregistré
typedRouter.post('/api/auth/login', async (req) => {
    const { email, password } = req.body

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            throw { error: 'Invalid credentials' }
        }

        console.log(user.password, password)

        // Vérifier le mot de passe de l'utilisateur
        if (user.password !== password) {
            throw { error: 'Invalid credentials.' }
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
        throw { error: 'Invalid credentials', details: e }
    }
})

export default router
