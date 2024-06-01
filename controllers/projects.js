const router = require('express').Router()
const { sequelize } = require('../util/db')
const { User, Employee, Project, Employee_Project, Ticket, Ticket_History, Status, User_Ticket } = require('../models')
const { tokenExtractor, checkPermissions } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
        },
        include: [
            {
                model: Employee,
                include: [{
                    model: Project,
                    through: {
                        model: Employee_Project
                        // where: { to: null }
                    }
                }]
            }
        ]
    })

    response.json(user.employee.projects)
})

router.get('/user/:id', async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.params.id
        },
        include: [
            {
                model: Employee,
                include: [{
                    model: Project,
                    through: {
                        model: Employee_Project
                        // where: { to: null }
                    }
                }]
            }
        ]
    })

    response.json(user.employee.projects)
})

router.get('/projectsWithRoles', tokenExtractor, async (request, response) => {
    const user = await User.findOne({
        where: {
            id: request.decodedToken.id
        },
        include: {
            model: Employee,
            include: {
                model: Employee_Project,
                include: {
                    model: Project
                }
            }
        }
    })

    console.log(user)

    const projectsWithRoles = user.employee.employee_projects.map(project => ({ role: project.roleId, project: project.project }))

    response.json(projectsWithRoles)
})

router.get('/availableProjectsByTeamId/:id', async (request, response) => {
    try {
        const teamId = request.params.id;
        // const projects = await Team.findAll({
        //     where: { id: teamId },
        //     include: [{
        //         model: Employment_History,
        //         include: [{
        //             model: Employee,
        //             include: [{
        //                 model: Employee_Project,
        //                 include: [{
        //                     model: Project,
        //                     attributes: ['name', 'id'],
        //                     distinct: true
        //                 }],
        //                 attributes: []
        //             }],
        //             attributes: []
        //         }],
        //         attributes: []
        //     }],
        //     attributes: [],
        //     distinct: true,
        //     group: ['team.id','employment_histories.employee.employee_projects.project.name','employment_histories.employee.employee_projects.project.id']
        // });

        const sql = `
        SELECT DISTINCT pr.id, pr.name 
            FROM teams t JOIN employment_histories eh ON t.id = eh.team_id
            JOIN employees e ON eh.employee_id = e.id
            JOIN employee_projects pp ON e.id = pp.employee_id
            JOIN projects pr ON pp.project_id = pr.id
            WHERE t.id = ${teamId};
        `;

        const projects = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
        response.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        response.status(500).send('Internal Server Error');
    }
})

router.get('/availableProjectsByOrganizationId/:id', async (request, response) => {
    try {
        const orgId = request.params.id;

        const sql = `
        SELECT DISTINCT pr.id, pr.name
            FROM organizations org
            JOIN teams t ON org.id = t.organization_id
            JOIN employment_histories eh ON t.id = eh.team_id
            JOIN employees e ON eh.employee_id = e.id
            JOIN employee_projects pp ON e.id = pp.employee_id
            JOIN projects pr ON pp.project_id = pr.id
            WHERE org.id = ${orgId}; 
        `;

        const projects = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
        response.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        response.status(500).send('Internal Server Error');
    }
})

router.get('/:id', async (request, response) => {
    try {
        const project = await Project.findOne({
            where: { id: request.params.id },
            include: [
                {
                    model: Employee,
                    through: {
                        model: Employee_Project,
                        where: { to: null }
                    },
                    include: User
                },
                {
                    model: Ticket,
                    include: [
                        {
                            model: Ticket_History,
                            include: [
                                {
                                    model: Status 
                                },
                                {
                                    model: Employee,
                                    include: [
                                        {
                                            model: User,
                                            attributes: ['name', 'surname']
                                        }
                                    ]
                                }
                            ]
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

router.post('/', tokenExtractor, checkPermissions(['createProject']), async (request, response) => {

    try {
        const project = await Project.create({ name: request.body.name, description: request.body.description })

        request.body.employees.forEach(async employee => {
            console.log(employee)
            await Employee_Project.create({
                since: new Date(),
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

router.put('/:projectId', tokenExtractor, async (request, response) => {
    const projectId = request.params.projectId;

    try {
        const user = await User.findByPk(request.decodedToken.id)
        const project = await Project.findByPk(projectId);
        if (!project) {
            return response.status(404).json({ error: 'Project not found' });
        }

        project.name = request.body.name ?? project.name;
        project.description = request.body.description ?? project.description;

        const currentEmployees = await Employee_Project.findAll({
            where: { projectId: projectId }
        });

        console.log("currentemployees")
        console.log(currentEmployees)

        const incomingEmployeeIds = new Set(request.body.employees.map(emp => emp.id));

        for (const currentEmployee of currentEmployees) {
            if (!incomingEmployeeIds.has(currentEmployee.employeeId) && !currentEmployee.to) {
                currentEmployee.to = new Date();
                await currentEmployee.save();
            }
        }

        for (const employee of request.body.employees) {
            const activeEmployee = currentEmployees.find(ep => ep.employeeId === employee.id && !ep.to);
            const inactiveEmployee = currentEmployees.find(ep => ep.employeeId === employee.id && ep.to);

            if (!activeEmployee) {
                if (inactiveEmployee) {
                    await Employee_Project.create({
                        since: new Date(),
                        manager: false,
                        employeeId: employee.id,
                        projectId: projectId,
                        roleId: employee.role_id
                    });
                } else {
                    await Employee_Project.create({
                        since: new Date(),
                        manager: false,
                        employeeId: employee.id,
                        projectId: projectId,
                        roleId: employee.role_id
                    });
                }
            } else {
                if (activeEmployee.roleId !== employee.role_id) {
                    activeEmployee.roleId = employee.role_id;
                    await activeEmployee.save();
                }
            }
        }

        await project.save();
        response.json(project);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/projectTickets/:id', async (request, response) => {
    try {
        sequelize.query(
            `SELECT "e->th->t"."id", 
                "user"."name", 
                "user"."surname", 
                "e->th->t->p"."name" AS "projectName",
                "e->th->t"."title" AS "title", 
                "e->th->t"."created_at" AS "createdAt",  
                "e->th->t->ty"."type" AS "type", 
                "e->th->s"."status" AS "status", 
                "e->th->pr"."priority" AS "priority" 
            FROM "users" AS "user" 
            JOIN "employees" AS "employee" 
                ON "user"."id" = "employee"."user_id" 
            FULL JOIN "ticket_histories" AS "e->th" 
                ON "employee"."id" = "e->th"."employee_id"
            JOIN "priorities" AS "e->th->pr"
                ON "e->th->pr"."id" = "e->th"."priority_id"
            JOIN "statuses" AS "e->th->s"
                ON "e->th->s"."id" = "e->th"."status_id"
            JOIN "tickets" AS "e->th->t"
                ON "e->th->t"."id" = "e->th"."ticket_id"
            JOIN "types" AS "e->th->t->ty"
                ON "e->th->t->ty"."id" = "e->th->t"."type_id"
            JOIN "projects" AS "e->th->t->p"
                ON "e->th->t->p"."id" = "e->th->t"."project_id"
            WHERE "e->th->t->p"."id" = :projectId AND "e->th"."id" IN (
                    SELECT find_last_edit.last_edit
                    FROM ( SELECT ticket_id, MAX(id) AS last_edit
                        FROM ticket_histories
                        GROUP BY ticket_id
                    ) find_last_edit
                )` 
            , {
            type: sequelize.QueryTypes.SELECT,
            replacements: { projectId: request.params.id },
        }).then(tickets => {
            response.json(tickets)
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
});

module.exports = router