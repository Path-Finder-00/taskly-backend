// const router = require('express').Router()

// const { User, Employee, Project, Employee_Project, Ticket, Ticket_History, Status, User_Ticket } = require('../models')
// const { tokenExtractor } = require('../util/middleware')

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

// module.exports = router