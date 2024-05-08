const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { User, Employee, Employment_History, Employee_Technology, Employee_Project, Client, Client_Project } = require('../models')

router.post('/', async (request, response) => {
    const { name, surname, email, password, phone, admin } = request.body

    if (password.length < 8) {
        return response.status(400).json({
            error: 'Password has to be at least 8 characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
        name: name,
        surname: surname,
        email: email,
        passwordHash: passwordHash,
        phone: phone,
        admin: admin,
        disabled: false,
    })

    if (!request.body.is_client === true){
        const employee = await Employee.create({
            userId: user.id
        })
    
        if (request.body.team !== "" && request.body.team != null) {
            employment_history = await Employment_History.create({
                employeeId: employee.id,
                team_lead: request.body.team_lead,
                teamId: request.body.team,
                since: new Date()
            })
        }
    
        if (request.body.technologies && request.body.technologies.length > 0) {
            request.body.technologies.forEach(async technology => {
                await Employee_Technology.create({
                    employeeId: employee.id,
                    technologyId: technology
                })
            });
        }
    
        if (request.body.project !== "" && request.body.project != null) {
            employee_project = await Employee_Project.create({
                employeeId: employee.id,
                projectId: request.body.project,
                since: new Date(),
                roleId: request.body.role,
                manager: false
            })
        }
    } else if (!request.body.is_client === false) {
        client = await Client.create({
            organizationId: request.body.organization,
            userId: user.id
        })
        client_project = await Client_Project.create({
            clientId: client.id,
            projectId: request.body.project,
            since: new Date()
        })
    }

    response.status(201).json(user)
})

module.exports = router