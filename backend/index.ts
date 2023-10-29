import cors from 'cors'
import express from 'express'
import { usePrisma } from './orm/database.js'
import { regenerateFixtures } from './orm/fixtures.js'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/task.js'
import userRoutes from './routes/user.js'

const app = express()
app.use(express.json())
app.use(cors())

async function main() {
    usePrisma()
    await regenerateFixtures()

    app.use(authRoutes)
    app.use(taskRoutes)
    app.use(userRoutes)

    app.listen(process.env.PORT || 3000, () => {
        console.info('Server started on port 3000')
    })
}

main().catch((e) => console.error(e))
