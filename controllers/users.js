const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { User, Employee, Employment_History, Employee_Technology, Employee_Project, Client, Client_Project, Technology } = require('../models')

router.post('/', async (request, response) => {
    const { name, surname, email, password, phone, accessId } = request.body

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
        disabled: false,
        accessId: accessId
    })

    if (!request.body.is_client === true) {
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

router.get('/:id', async (request, response) => {
    try {
        const user = await User.findOne({
            where: { id: request.params.id },
            include: {
                model: Employee,
                include: {
                    model: Technology,
                    // attributes: ['technology']
                },
            },
            attributes: ['email', 'id', 'name', 'surname', 'phone']
        });

        if (user) {
            response.json(user);
        } else {
            response.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});


router.put('/:userId', async (request, response) => {
    const { name, surname, email, password, phone, admin, disabled } = request.body
    const userId = request.params.userId;

    try {
        const user = await User.findByPk(userId)
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }

        if (password.length < 8) {
            return response.status(400).json({
                error: 'Password has to be at least 8 characters long'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        user.name = name ?? user.name
        user.surname = surname ?? user.surname
        user.email = email ?? user.email
        user.passwordHash = passwordHash ?? user.passwordHash
        user.phone = phone ?? user.phone
        user.admin = admin ?? user.admin
        user.disabled = disabled ?? user.disabled

        await user.save();

        if (!request.body.is_client === true) {
            const employee = await Employee.findOne({
                where: { user_id: userId }
            })

            const existingTechs = await Employee_Technology.findAll({
                where: { employee_id: employee.id },
                attributes: ['technologyId']
            })

            const currentTechIds = existingTechs.map(et => et.technologyId);

            const newTechIds = request.body.technologies;

            const techsToRemove = currentTechIds.filter(id => !newTechIds.includes(id));

            const techsToAdd = newTechIds.filter(id => !currentTechIds.includes(id));

            await Employee_Technology.destroy({
                where: {
                    employeeId: employee.id,
                    technologyId: techsToRemove
                }
            });

            for (const techId of techsToAdd) {
                await Employee_Technology.create({
                    employeeId: employee.id,
                    technologyId: techId
                });
            }
        }

        response.json(user)

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router