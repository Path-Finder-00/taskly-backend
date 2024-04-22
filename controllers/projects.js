const router = require('express').Router()

const { User, Employee, Project, Employee_Project, Ticket, Ticket_History, Status, User_Ticke } = require('../models')
const User_Ticket = require('../models/user_ticket')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
        },
        include: [
            {
                model: Employee,
                include: [
                    Project
                ]
            }
        ]
    })

    //TODO: Because both an employee and a client can have projects,
    // make sure that the endpoint return project data regardless of
    // user position.
    response.json(user.employee.projects)
})

router.get('/:id', async (request, response) => {
    try {
        const project = await Project.findOne({
            where: { id: request.params.id },
            include: [
                {
                    model: Employee,
                    include: User
                },
                {
                    model: Ticket,
                    include: [
                        {
                            model: Ticket_History,
                            include: Status
                        },
                        {
                            model: User_Ticket
                        }
                    ]
                }
            ]
        });

        if (project) {
            response.json(project);
        } else {
            response.status(404).send('Project not found');
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }

    // TODO: move to seperate endpoints
});

router.post('/', tokenExtractor, async (request, response) => {

    try {
        const user = await User.findByPk(request.decodedToken.id)
        const project = await Project.create({ name: request.body.name, description: request.body.description })
        const project_manager = await Employee_Project.create({ since: new Date(), manager: true, employeeId: request.decodedToken.id, projectId: project.id })

        request.body.employees.forEach(async employee => {
            await Employee_Project.create({
                since: new Date(),
                manager: false,
                employeeId: employee.id,
                projectId: project.id,
                roleId: employee.role_id
            })
        });

        response.json(project);

    } catch (error) {
        console.log(error)
        return response.status(400).json({ error })
    }
})

module.exports = router