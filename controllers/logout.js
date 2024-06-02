const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { Session } = require('../models')

router.delete('/', async (request, response) => {
    const authorization = request.get('authorization')
    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    if (!token) {
        return response.status(401).json({ error: 'Token missing or invalid' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        
        const session = await Session.findOne({ where: { token } })
        if (!session) {
            return response.status(401).json({ error: 'Session not found' })
        }

        await session.destroy()

        response.status(200).json({ message: 'Successfully logged out.' })
    } catch (error) {
        return response.status(401).json({ error: 'Token invalid' })
    }
})

module.exports = router