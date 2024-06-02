const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Ticket, User, Ticket_History, User_Ticket, Employee, Employment_History, Organization } = require('../models')
const { tokenExtractor, checkPermissions } = require('../util/middleware')
const { getPermissions } = require('../util/getPermissions')

router.get('/', tokenExtractor, async (request, response, next) => {
    try {
        const user = await User.findByPk(request.decodedToken.id)

        if (user.accessId !== 5) { // Check whether the user is not a client
            sequelize.query(`
                SELECT "e->th->t"."id", 
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
                JOIN "ticket_histories" AS "e->th" 
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
                WHERE "user"."id" = :userId AND "e->th"."id" IN (
                        SELECT find_last_edit.last_edit
                        FROM ( SELECT ticket_id, MAX(id) AS last_edit
                            FROM ticket_histories
                            GROUP BY ticket_id
                        ) find_last_edit
                    )
                ORDER BY "createdAt"
            `, {
                type: sequelize.QueryTypes.SELECT,
                replacements: { userId: request.decodedToken.id },
            }).then(tickets => {
                response.json(tickets)
            })
        } else {
            sequelize.query(`
                SELECT "ut->t"."id",
                    "user"."name",
                    "user"."surname",
                    "ut->t->p"."name" AS "projectName",
                    "ut->t"."title" AS "title",
                    "ut->t"."created_at" AS "createdAt",
                    "ut->t->ty"."type" AS "type",
                    "ut->t->th->s"."status" AS "status",
                    "ut->t->th->pr"."priority" AS "priority"
                FROM "users" AS "user"
                JOIN "user_tickets" AS "userTickets"
                    ON "user"."id" = "userTickets"."user_id"
                JOIN "tickets" AS "ut->t"
                    ON "userTickets"."ticket_id" = "ut->t"."id"
                JOIN "projects" AS "ut->t->p"
                    ON "ut->t"."project_id" = "ut->t->p"."id"
                JOIN "types" AS "ut->t->ty"
                    ON "ut->t"."type_id" = "ut->t->ty"."id"
                JOIN "ticket_histories" AS "ut->t->th"
                    ON "ut->t"."id" = "ut->t->th"."ticket_id"
                JOIN "statuses" AS "ut->t->th->s"
                    ON "ut->t->th"."status_id" = "ut->t->th->s"."id"
                JOIN "priorities" AS "ut->t->th->pr"
                    ON "ut->t->th"."priority_id" = "ut->t->th->pr"."id"
                WHERE "user"."id" = :userId AND "ut->t->th"."id" IN (
                    SELECT find_last_edit.last_edit
                    FROM ( SELECT ticket_id, MAX(id) AS last_edit
                        FROM ticket_histories
                        GROUP BY ticket_id
                    ) find_last_edit
                )
                ORDER BY "createdAt"
            `, {
                type: sequelize.QueryTypes.SELECT,
                replacements: { userId: request.decodedToken.id },
            }).then(tickets => {
                response.json(tickets)
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/allTickets', tokenExtractor, checkPermissions(['seeAllTickets']), async (request, response, next) => {
    try {
        const user = await User.findByPk(request.decodedToken.id)

        sequelize.query(`
        SELECT DISTINCT "tickets"."id", 
            "users"."name", 
            "users"."surname", 
            "projects"."name" AS "projectName",
            "tickets"."title" AS "title", 
            "tickets"."created_at" AS "createdAt",  
            "types"."type" AS "type", 
            "statuses"."status" AS "status", 
            "priorities"."priority" AS "priority"
        FROM "organizations"
        JOIN "users"
            ON "organizations"."id" = "users"."organization_id"
        JOIN "user_tickets"
            ON "users"."id" = "user_tickets"."user_id"
        JOIN "tickets"
            ON "user_tickets"."ticket_id" = "tickets"."id"
        JOIN "projects"
            ON "tickets"."project_id" = "projects"."id"
        JOIN "ticket_histories"
            ON "tickets"."id" = "ticket_histories"."ticket_id"
        JOIN "priorities"
            ON "priorities"."id" = "ticket_histories"."priority_id"
        JOIN "statuses"
            ON "statuses"."id" = "ticket_histories"."status_id"
        JOIN "types"
            ON "types"."id" = "tickets"."type_id"
        WHERE "organizations"."id" = :organizationId
        AND "ticket_histories"."id" IN (
                SELECT find_last_edit.last_edit
                FROM ( SELECT ticket_id, MAX(id) AS last_edit
                FROM ticket_histories
                GROUP BY ticket_id
            ) find_last_edit
        )
        ORDER BY "createdAt"
        `, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { organizationId: user.organizationId },
        }).then(tickets => {
            response.json(tickets)
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/allTicketsInTeam', tokenExtractor, checkPermissions(['seeAllTicketsInTeam']), async (request, response, next) => {
    try {
        const user = await User.findByPk(request.decodedToken.id)
        
        const employment_history = await Employment_History.findOne({
            where: {to: null},
            include: {
                model: Employee,
                where: {id: request.decodedToken.id}
            }
        })

        team_id = employment_history.teamId

        const sql = `
        SELECT DISTINCT pr.id, pr.name, pr.description
            FROM teams t
            JOIN employment_histories eh ON t.id = eh.team_id 
            JOIN employees e ON eh.employee_id = e.id
            JOIN employee_projects pp ON e.id = pp.employee_id
            JOIN projects pr ON pp.project_id = pr.id
            WHERE t.id = ${team_id} and eh.to IS NULL;
        `;

        const projectsInTeam = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });

        const projectInTeamIds = projectsInTeam.map(project => project.id)

        sequelize.query(`
            SELECT 
                "tickets"."id", 
                "users"."name", 
                "users"."surname", 
                "projects"."name" AS "projectName",
                "tickets"."title", 
                "tickets"."created_at" AS "createdAt",  
                "types"."type", 
                "statuses"."status", 
                "priorities"."priority"
            FROM 
                "tickets"
            JOIN 
                "projects" ON "tickets"."project_id" = "projects"."id"
            JOIN 
                "types" ON "tickets"."type_id" = "types"."id"
            LEFT JOIN 
                "ticket_histories" ON "tickets"."id" = "ticket_histories"."ticket_id"
            LEFT JOIN 
                "statuses" ON "ticket_histories"."status_id" = "statuses"."id"
            LEFT JOIN 
                "priorities" ON "ticket_histories"."priority_id" = "priorities"."id"
            LEFT JOIN 
                "employees" ON "ticket_histories"."employee_id" = "employees"."id"
            LEFT JOIN 
                "users" ON "employees"."user_id" = "users"."id"
            WHERE 
                "projects"."id" = ANY(ARRAY[:projectIds]::integer[])
            AND 
                ("ticket_histories"."id" IS NULL OR "ticket_histories"."id" IN (
                    SELECT find_last_edit.last_edit
                    FROM (
                        SELECT ticket_id, MAX(id) AS last_edit
                        FROM ticket_histories
                        GROUP BY ticket_id
            ) find_last_edit ))
            ORDER BY "createdAt"
            `, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { projectIds: projectInTeamIds },
        }).then(tickets => {
            response.json(tickets)
        })
    
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/', tokenExtractor, async (request, response) => {

    const hasPermission = await getPermissions(request.decodedToken.id, ['assignUser'])
    if (!hasPermission && request.body.assigned) {
        return response.status(403).json({
            error: 'Forbidden'
        })
    }

    try {
        const user = await User.findByPk(request.decodedToken.id)

        const ticket = await Ticket.create({
            title: request.body.title,
            description: request.body.description,
            created_at: new Date(),
            projectId: request.body.project,
            typeId: request.body.type
        })
        const ticket_history = await Ticket_History.create({
            employeeId: request.body.assigned,
            statusId: request.body.assigned ? 2 : 1,
            priorityId: request.body.priority,
            ticketId: ticket.id,
            since: request.body.assigned ? new Date() : null
        })
        const user_ticket = await User_Ticket.create({
            ticketId: ticket.id,
            userId: user.id
        })

        response.json(ticket);

    } catch (error) {
        console.log(error)
        return response.status(400).json({ error })
    }
})

router.get('/:id', async (request, response) => {
    try {
        const ticket = await Ticket.findOne({
            where: { id: request.params.id },
            include: [
                {
                    model: User_Ticket,
                    attributes: ['id'],
                    include: {
                        model: User,
                        attributes: ['name', 'surname']
                    }
                },
                {
                    model: Ticket_History,
                }
            ]
        });

        if (ticket) {
            response.json(ticket);
        } else {
            response.status(404).send('Ticket not found');
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

router.put('/:ticketId', tokenExtractor, async (request, response) => {
    const ticketId = request.params.ticketId;
    const user = await User.findByPk(request.decodedToken.id)
    const hasPermission = await getPermissions(request.decodedToken.id, ['assignUser'])
    if (!hasPermission && request.body.assigned) {
        return response.status(403).json({
            error: 'Forbidden'
        })
    }
    try {
        if (request.body.assigned && user.access_id === 5) {
            return response.status(403).message("Only employees can assign a developer.")
        }
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return response.status(404).json({ error: 'Ticket not found' });
        }

        ticket.title = request.body.title ?? ticket.title;
        ticket.description = request.body.description ?? ticket.description;
        ticket.projectId = request.body.project ?? ticket.projectId;
        ticket.typeId = request.body.type ?? ticket.typeId;

        const lastHistory = await Ticket_History.findOne({
            where: { ticket_id: ticketId },
            order: [['createdAt', 'DESC']]
        });
        if (lastHistory && !lastHistory.to) {
            lastHistory.to = new Date();
            await lastHistory.save();
        }

        const ticket_history = await Ticket_History.create({
            employeeId: request.body.assigned,
            statusId: request.body.assigned ? 2 : 1,
            priorityId: request.body.priority,
            ticketId: ticket.id,
            since: request.body.assigned ? new Date() : null
        })
        await ticket.save();

        response.json(ticket);

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router