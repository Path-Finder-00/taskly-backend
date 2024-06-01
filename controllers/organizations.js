const router = require('express').Router()

const { User, Organization, Team } = require('../models')
const { tokenExtractor, checkPermissions } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    try {
        const user = await User.findOne({
            where: {
                id: request.decodedToken.id
            },
            include: [
                {
                    model: Organization
                }
            ]
        })

        response.json(user.organization)

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

router.get('/users', tokenExtractor, checkPermissions(['seeAllUsers']),  async (request, response) => {
    try {
        const user = await User.findOne({
            where: {
                id: request.decodedToken.id
            }
        })

        const users = await User.findAll({
            where: {
                organizationId: user.organizationId
            }
        })

        response.json(users)
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message)
    }
})

router.get('/teams/:id', async (request, response) => {
    try {
        const organizationId = request.params.id;
        const teams = await Team.findAll({
            where: { organizationId: organizationId }
        });
        
        response.json(teams);

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router