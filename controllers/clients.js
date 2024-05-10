const router = require('express').Router()
const { Project, Client, Organization, Client_Project } = require('../models')

router.get('/:id', async (request, response) => {
    try {
        const client = await Client.findOne({
            where: { userId: request.params.id },
            include: [
                {
                    model: Organization,
                },
                {
                    model: Client_Project,
                    include: {
                        model: Project,
                        attributes: ["name"]
                    },
                }
            ]
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