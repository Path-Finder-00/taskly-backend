const router = require('express').Router()

const { User, Employee, Project, Employee_Project, Ticket, Comment } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/:id', tokenExtractor, async (request, response) => {
    // const user = await User.findOne({
    //     where: {
    //         id: request.decodedToken.id
    //     },
    //     include: [
    //         {
    //             model: Employee,
    //             include: [
    //                 Project
    //             ]
    //         }
    //     ]
    // })
    // response.json(user.employee.projects)
    const ticket = await Ticket.findOne({
        where: {
            id: request.params.id
        },
        include: [
            {
                model: Comment
            }
        ]
    })
    response.json(ticket.comments)
})


router.post('/:id', tokenExtractor, async (request, response) => {

    // try {
    //     const user = await User.findByPk(request.decodedToken.id)
    //     const project = await Project.create({ name: request.body.name, description: request.body.description })
    //     const project_manager = await Employee_Project.create({ since: new Date(), manager: true, employeeId: request.decodedToken.id, projectId: project.id })

    //     request.body.employees.forEach(async employee => {
    //         await Employee_Project.create({
    //             since: new Date(),
    //             manager: false,
    //             employeeId: employee.id,
    //             projectId: project.id,
    //             roleId: employee.role_id
    //         })
    //     });

    //     response.json(project);

    // } catch (error) {
    //     console.log(error)
    //     return response.status(400).json({ error })
    // }
    try {
        const comment = await Comment.create({
            user_id: request.decodedToken.id,
            ticket_id: request.params.id,
            comment: request.body.comment
        })

        response.json(comment)
    } catch (error) {
        return response.status(400).json({ error })
    }
})

module.exports = router