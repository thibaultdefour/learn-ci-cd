import express from 'express'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
    res.status(600).send()
})

export default router
