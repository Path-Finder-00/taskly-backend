const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Session, User, Access, Access_Permission, Permission } = require('../models')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
    logger.error(error)
}

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

const checkPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const user = await User.findOne({
                where: {
                    id: req.decodedToken.id
                },
                include: {
                    model: Access,
                    include: {
                        model: Access_Permission,
                        include: {
                            model: Permission,
                            attributes: ['name']
                        },
                        attributes: ['id']
                    },
                    attributes: ['id']
                },
                attributes: ['id']
            });
        
            const permissions = user.access.access_permissions.map(access_permission => access_permission.permission.name)
            const hasPermission = requiredPermissions.every(permission => permissions.includes(permission))

            if (!hasPermission) {
                return res.status(403).json({ error: 'Forbidden' })
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    errorHandler,
    tokenExtractor,
    checkPermissions
}