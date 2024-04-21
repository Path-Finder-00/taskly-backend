const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Ticket, Project, Employee, User, Priority, Status, Type, Ticket_History, Employee_Project } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response, next) => {
    try {
        // const user = await User.findOne({
        //     where: {
        //         id: request.decodedToken.id
        //     },
        //     attributes: ['name', 'surname'],
        //     include: [
        //         {
        //             model: Employee,
        //             as: 'Emp',
        //             attributes: [],
        //             include: [
        //                 {
        //                     model: Employee_Project,
        //                     as: 'EmpProj',
        //                     attributes: [],
        //                     include: [
        //                         {
        //                             model: Project,
        //                             as: 'Proj',
        //                             attributes: ['name'],
        //                             include: [
        //                                 {
        //                                     model: Ticket,
        //                                     as: 'ProjTickets',
        //                                     attributes: ['title', 'created_at'],
        //                                     include: [
        //                                         {
        //                                             model: Type,
        //                                             as: 'TicketType',
        //                                             attributes: ['type'],
        //                                         },
        //                                         {
        //                                             model: Ticket_History,
        //                                             as: 'TickHist',
        //                                             attributes: [],
        //                                             include: [
        //                                                 {
        //                                                     model: Status,
        //                                                     as: 'TickStatus',
        //                                                     attributes: ['status'],
        //                                                 },
        //                                                 {
        //                                                     model: Priority,
        //                                                     as: 'TickPriority',
        //                                                     attributes: ['priority']
        //                                                 }
        //                                             ]
        //                                         }
        //                                     ]
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ],
        //         }
        //     ]
        sequelize.query(`
            SELECT "user"."id", 
                "user"."name", 
                "user"."surname", 
                "e->ep->p"."name" AS "projectName",
                "e->ep->p->t"."title" AS "title", 
                "e->ep->p->t"."created_at" AS "createdAt",  
                "e->ep->p->t->ty"."type" AS "type", 
                "e->ep->p->t->th->s"."status" AS "status", 
                "e->ep->p->t->th->pr"."priority" AS "priority" 
            FROM "users" AS "user" 
            LEFT OUTER JOIN "employees" AS "employee" 
                ON "user"."id" = "employee"."user_id" 
            LEFT OUTER JOIN "employee_projects" AS "e->ep" 
                ON "employee"."id" = "e->ep"."employee_id" 
            LEFT OUTER JOIN "projects" AS "e->ep->p" 
                ON "e->ep"."project_id" = "e->ep->p"."id" 
            LEFT OUTER JOIN "tickets" AS "e->ep->p->t" 
                ON "e->ep->p"."id" = "e->ep->p->t"."project_id" 
            LEFT OUTER JOIN "types" AS "e->ep->p->t->ty" 
                ON "e->ep->p->t"."type_id" = "e->ep->p->t->ty"."id" 
            LEFT OUTER JOIN "ticket_histories" AS "e->ep->p->t->th" 
                ON "e->ep->p->t"."id" = "e->ep->p->t->th"."ticket_id" 
            LEFT OUTER JOIN "statuses" AS "e->ep->p->t->th->s" 
                ON "e->ep->p->t->th"."status_id" = "e->ep->p->t->th->s"."id" 
            LEFT OUTER JOIN "priorities" AS "e->ep->p->t->th->pr" 
                ON "e->ep->p->t->th"."priority_id" = "e->ep->p->t->th->pr"."id"
            WHERE "user"."id" = :userId;
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

module.exports = router