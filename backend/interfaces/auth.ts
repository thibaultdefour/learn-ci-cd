import type { Prisma } from '../orm/prisma/client'
import type { AuthAPI } from '../routes/auth.js'

export type { AuthAPI }

export type AuthUser = Prisma.UserGroupByOutputType
