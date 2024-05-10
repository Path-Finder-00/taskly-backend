const router = require('express').Router()

const { Organization, Team } = require('../models')

router.get('/', async (request, response) => {
    const organizations = await Organization.findAll()

    response.json(organizations)
})

router.get('/:id', async (request, response) => {
    try {
        const teamId = request.params.id;
        const organization = await Organization.findOne({
            include: [{
                model: Team,
                where: { id: teamId },
            }]
        });
        
        response.json(organization);

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router