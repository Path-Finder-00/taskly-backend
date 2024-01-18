const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
    try {
        const authorization = req.get('authorization')
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            try {
                req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
                const sessionExists = await Session.findOne({
                    where: {
                        user_id: req.decodedToken.id
                    }
                })
                if (!sessionExists) {
                    return res.status(401).json({ error: 'operation not allowed, log in again' })
                }
            } catch {
                return res.status(401).json({ error: 'token invalid' })
            }
        } else {
            return res.status(401).json({ error: 'token missing' })
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    tokenExtractor
}