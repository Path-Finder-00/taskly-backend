const router = require('express').Router()

const { User, Employee, Team, Organization } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// router.get('/:id', async (request, response) => {
//     try {
//         const employee = await Employee.findOne({
//             where: { id: request.params.id },
//             include: {
//                 model: User,
//                 attributes: ['name', 'surname']
//             },
//             attributes: ['id']
//         });

//         if (employee) {
//             response.json(employee);
//         } else {
//             response.status(404).send('Employee not found');
//         }
//     } catch (error) {
//         console.error(error);
//         response.status(500).send(error.message);
//     }
// });

router.get('/all', tokenExtractor, async (request, response) => {
    try {
        // // retrieving the user's organization.id
        // const employee = await Employee.findOne({
        //     where: { user_id: request.decodedToken.id },
        //     include: {
        //         model: Team,
        //         include: {
        //             model: Organization
        //         }
        //     }
        // })

        // const organizationId = employee.teams[0].organizations[0].id;
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

