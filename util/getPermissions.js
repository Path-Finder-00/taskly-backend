const { User, Access, Access_Permission, Permission } = require('../models')

const getPermissions = async (id, requiredPermissions) => {
    try {
        const user = await User.findOne({
            where: {
                id: id
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

        return hasPermission
    } catch (error) {
        console.log("Unable to get permissions: ", error)
    }
}

module.exports = { getPermissions }