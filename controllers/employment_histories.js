const router = require('express').Router()
const { Employee, Team, Employment_History } = require('../models')

router.get('/:id', async (request, response) => {
    try {
        const employment_history = await Employment_History.findAll({
            include: [
                {
                    model: Employee,
                    where: { userId: request.params.id }
                },
                {
                    model: Team,
                }
            ]
        });

        if (employment_history) {
            response.json(employment_history);
        } else {
            response.status(404).send('Employment History not found');
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router