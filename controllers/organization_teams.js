const router = require('express').Router()

const { Organization_Team, Team } = require('../models')

router.get('/:id', async (request, response) => {
    try {
        const organizationId = request.params.id;
        const teams = await Organization_Team.findAll({
            where: { organizationId: organizationId },
            include: [{
                model: Team,
            }]
        });
        
        response.json(teams);

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router