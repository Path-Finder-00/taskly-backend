const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Ticket, Project, Employee, User, Priority, Status, Type, Ticket_History, Employee_Project, User_Ticket } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/:id', async (request, response) => {
    try {
        const ticket_histories = await Ticket_History.findAll({
            where: { ticket_id: request.params.id },
        });

        if (ticket_histories) {
            response.json(ticket_histories);
        } else {
            response.status(404).send('Ticket histories not found');
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router