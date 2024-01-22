const router = require('express').Router()

const { User, Project } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
        },
        include: Project
    })

    response.json(user.projects)
})

module.exports = router