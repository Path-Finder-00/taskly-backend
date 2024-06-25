const router = require('express').Router()

const { Ticket_History } = require('../models')

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
