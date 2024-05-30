const router = require('express').Router()
const { Project, Client, Organization, Client_Project, User, Team, Employee } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/all', tokenExtractor, async (request, response) => {
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

        const clientsInOrganization = await User.findAll({
            include: {
                model: Client,
                where: { organization_id: organizationId },
                required: true
            },
            attributes: ['email', 'id', 'name', 'surname', 'phone']
        });

        response.json(clientsInOrganization)

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

router.get('/:id', async (request, response) => {
    try {
        const client = await User.findOne({
            where: { id: request.params.id },
            include: [
                {
                    model: Organization,
                },
                {
                    model: Client,
                    include: {
                        model: Client_Project,
                        include: {
                            model: Project
                        }
                    },
                }
            ],
            attributes: { exclude: ['passwordHash'] }
        });

        if (client) {
            response.json(client);
        } else {
            response.status(404).send("Client not found");
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router