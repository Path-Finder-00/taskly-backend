const router = require('express').Router()

const { User, Employee, Team, Organization } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/all', tokenExtractor, async (request, response) => {
    try {
        const user = await User.findOne({
            where: { id: request.decodedToken.id }
        })

        const employeesInOrganization = await User.findAll({
            include: {
                model: Employee,
                include: {
                    model: Team,
                    include: {
                        model: Organization,
                        where: { id: user.organizationId }
                    },
                    required: true
                },
                required: true
            },
            attributes: ['email', 'id', 'name', 'surname', 'phone']
        });

        response.json(employeesInOrganization)

    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router
