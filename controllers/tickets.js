const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Ticket, Project, Employee, User, Priority, Status, Type, Ticket_History, Employee_Project, User_Ticket } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response, next) => {
    try {
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
        `, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { userId: request.decodedToken.id },
        }).then(tickets => {
            response.json(tickets)
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/', tokenExtractor, async (request, response) => {

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
            date_since: request.body.assigned ? new Date() : null,
            created_at: new Date()
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

    try {
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
        if (lastHistory && !lastHistory.date_to) {
            lastHistory.date_to = new Date();
            await lastHistory.save();
        }

        const ticket_history = await Ticket_History.create({
            employeeId: request.body.assigned,
            statusId: request.body.assigned ? 2 : 1,
            priorityId: request.body.priority,
            ticketId: ticket.id,
            date_since: request.body.assigned ? new Date() : null,
            created_at: new Date()
        })
        await ticket.save();

        response.json(ticket);

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router