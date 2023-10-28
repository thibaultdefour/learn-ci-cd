import cors from 'cors'
import express from 'express'
import { initializeDatabase } from './orm/bootstrap.js'
import { regenerateFixtures } from './orm/fixtures.js'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/task.js'
import userRoutes from './routes/user.js'

const app = express()
app.use(express.json())
app.use(cors())

async function main() {
    await initializeDatabase()
    await regenerateFixtures()

    app.use(authRoutes)
    app.use(taskRoutes)
    app.use(userRoutes)

    app.use((req, res, next) => {
        // if (res instanceof Error) {
        res.status(400).send('fsf')
        // }
    })

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server started on port 3000')
    })
}

main().catch((e) => console.error(e))
