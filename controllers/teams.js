const router = require('express').Router()

const { Team, User, Employee } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/members', tokenExtractor,  async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
        },
        include: [
            {
                model: Employee,
                include: [
                    Team
                ]
            }
        ]
    })

    response.json(roles)
})

module.exports = router