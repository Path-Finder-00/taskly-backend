const router = require('express').Router()

const { Organization, Team, Employee } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    try {
        // retrieving the user's organization.id
        const employee = await Employee.findOne({
            where: { user_id: request.decodedToken.id },
            include: {
                model: Team,
                include: {
                    model: Organization
                }
            }
        })
        const organizationId = employee.teams[0].organizations[0].id;

        response.json(organizationId)

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

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