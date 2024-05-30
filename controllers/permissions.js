const router = require('express').Router()

const { User, Access, Access_Permission, Permission } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
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

    response.json(permissions)
})

module.exports = router