const router = require('express').Router()
const { sequelize } = require('../util/db')
const { User, Employee, Project, Employee_Project, Ticket, Ticket_History, Status, User_Ticket, Team, Employment_History, Organization_Team } = require('../models')
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
        console.log(orgId)

        const sql = `
        SELECT DISTINCT pr.id, pr.name
            FROM organizations org
            JOIN organization_teams ot ON org.id = ot.organization_id
            JOIN teams t ON ot.team_id = t.id
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

router.put('/:projectId', tokenExtractor, async (request, response) => {
    const projectId = request.params.projectId;

    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return response.status(404).json({ error: 'Project not found' });
        }

        project.name = request.body.name ?? project.name;
        project.description = request.body.description ?? project.description;

        const currentEmployees = await Employee_Project.findAll({
            where: { projectId: projectId }
        });

        const incomingEmployeeIds = new Set(request.body.employees.map(emp => emp.id));

        for (const currentEmployee of currentEmployees) {
            if (!incomingEmployeeIds.has(currentEmployee.employeeId)) {
                currentEmployee.to = new Date();
                await currentEmployee.save();
            }
        }

        for (const employee of request.body.employees) {
            const existingEmployee = currentEmployees.find(ep => ep.employeeId === employee.id);

            if (!existingEmployee) {
                employee_project = await Employee_Project.create({
                    since: new Date(),
                    manager: false,
                    employeeId: employee.id,
                    projectId: projectId,
                    roleId: employee.role_id
                })
            } if (existingEmployee.roleId !== employee.role_id) {
                existingEmployee.roleId = employee.role_id;
                await existingEmployee.save();
            }
        }

        await project.save();
        response.json(project);

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router