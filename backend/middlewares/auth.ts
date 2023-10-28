import type { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../consts/secret.js'
import type { AuthUser } from '../interfaces/auth'

export type AuthReq<T extends object> = T & { user: AuthUser }

const authMiddleware = ((req: Request & { user: AuthUser }, res: Response, next: NextFunction) => {
    // Récupération du token d'authentification depuis le header Authorization
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    // Si le token n'est pas présent ou n'est pas valide, renvoie une erreur 401 Unauthorized
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', details: 'Missing token' })
    }

    // Vérification et décryptage du token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Invalid token' })
        }

        if (decodedToken) {
            req.user = decodedToken as AuthUser
        }
        next()
    })
}) as RequestHandler

export default authMiddleware
