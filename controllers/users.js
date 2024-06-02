const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { User, Employee, Employment_History, Employee_Technology, Employee_Project, Technology } = require('../models')
const { tokenExtractor, checkPermissions } = require('../util/middleware')
const { getPermissions } = require('../util/getPermissions')

router.post('/', tokenExtractor, checkPermissions(['createUser']), async (request, response) => {
    console.log(request.body)
    const { name, surname, email, password, phone, admin, technologies, team, project, team_lead, role, is_client, organization } = request.body

    if (password.length < 8) {
        return response.status(400).json({
            error: 'Password has to be at least 8 characters long'
        })
    }
    const hasPermission = await getPermissions(request.decodedToken.id, ['createHighAccessUser'])
    if (!hasPermission && (admin || team_lead)) {
        return response.status(403).json({
            error: 'Forbidden'
        })
    }

    const emailExists = await User.findOne({
        where: { email: email }
    });

    if (emailExists) {
        return response.status(409).json({
            error: 'Email exists'
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
        accessId: admin ? 1 : team_lead ? 2 : is_client ? 5 : 4,
        organizationId: organization
    })

    const employee = await Employee.create({
        userId: user.id
    })

    if (team !== "" && team != null) {
        const employment_history = await Employment_History.create({
            employeeId: employee.id,
            teamId: team,
            since: new Date()
        })
    }

    if (technologies && technologies.length > 0) {
        technologies.forEach(async technology => {
            await Employee_Technology.create({
                employeeId: employee.id,
                technologyId: technology
            })
        });
    }

    if (project !== "" && project != null) {
        const employee_project = await Employee_Project.create({
            employeeId: employee.id,
            projectId: project,
            since: new Date(),
            roleId: role,
            manager: false
        })
    }

    response.status(201).json(user)
})

router.get('/:id', tokenExtractor, async (request, response) => {
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
            attributes: ['email', 'id', 'name', 'surname', 'phone', 'accessId']
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


router.put('/:userId', tokenExtractor, async (request, response) => {
    const { name, surname, email, password, phone, admin, disabled, team_lead, is_client } = request.body
    const userId = request.params.userId;

    try {
        const user = await User.findByPk(userId)
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }

        if (password.length > 0 && password.length < 8) {
            return response.status(400).json({
                error: 'Password has to be at least 8 characters long'
            })
        }

        if (user.email !== email) {
            const emailExists = await User.findOne({
                where: { email: email }
            });

            if (emailExists) {
                return response.status(409).json({
                    error: 'Email exists'
                })
            }
        }

        const saltRounds = 10
        const passwordHash = password.length > 0 ? await bcrypt.hash(password, saltRounds) : null

        const updatedUser = {
            name: name ?? user.name,
            surname: surname ?? user.surname,
            email: email ?? user.email,
            passwordHash: passwordHash ?? user.passwordHash,
            phone: phone ?? user.phone,
            accessId: admin ? 1 : team_lead ? 2 : is_client ? 5 : 4,
            disabled: disabled ?? user.disabled
        };

        const hasEditUserInTeamPermission = await getPermissions(request.decodedToken.id, ['editUserInTeam'])
        const hasEditAnyUserPermission = await getPermissions(request.decodedToken.id, ['editAnyUser'])

        const employee = await Employee.findOne({
            where: { user_id: userId }
        })

        if (!request.body.is_client) {
            const employment_histories = await Employment_History.findAll({
                where: { employee_id: employee.id }
            })

            const current = employment_histories.find(eh => eh.to === null)

            if (!hasEditUserInTeamPermission && (
                updatedUser.name !== user.name ||
                updatedUser.surname !== user.surname ||
                updatedUser.email !== user.email ||
                updatedUser.phone !== user.phone ||
                updatedUser.accessId !== user.accessId ||
                updatedUser.disabled !== user.disabled ||
                request.body.team !== current.teamId
            )) {
                return response.status(403).json({
                    error: 'Forbidden'
                })
            }

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

            if (current) {
                if (current.teamId !== request.body.team) { // For employees with team
                    current.to = new Date();
                    await current.save();

                    await Employment_History.create({
                        employeeId: employee.id,
                        teamId: request.body.team,
                        since: new Date(),
                        to: null,
                    });
                }
            } else if (!current) { // For employees without team
                await Employment_History.create({
                    employeeId: employee.id,
                    teamId: request.body.team,
                    since: new Date(),
                    to: null,
                    team_lead: request.body.team_lead
                });
            }

        } else if (request.body.is_client) {
            const employee_projects = await Employee_Project.findAll({
                where: { employee_id: employee.id }
            })

            const current = employee_projects.find(ep => ep.to === null)

            if (!hasEditAnyUserPermission && (
                updatedUser.name !== user.name ||
                updatedUser.surname !== user.surname ||
                updatedUser.email !== user.email ||
                updatedUser.phone !== user.phone ||
                updatedUser.accessId !== user.accessId ||
                request.body.project !== current.projectId
            )) {
                return response.status(403).json({
                    error: 'Forbidden'
                })
            }

            if (current.projectId !== request.body.project) { // client will always be associated with project
                current.to = new Date();
                await current.save();

                await Employee_Project.create({
                    employeeId: employee.id,
                    projectId: request.body.project,
                    since: new Date(),
                    to: null,
                    roleId: 6
                });
            }
        }

        user.name = updatedUser.name
        user.surname = updatedUser.surname
        user.email = updatedUser.email
        user.passwordHash = updatedUser.passwordHash
        user.phone = updatedUser.phone
        user.accessId = updatedUser.accessId
        user.disabled = updatedUser.disabled

        await user.save();

        response.json(user)

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router