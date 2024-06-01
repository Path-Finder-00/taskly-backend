const router = require('express').Router()
const { Employee, Project, Employee_Project } = require('../models')

router.get('/:id', async (request, response) => {
    try {
        const employee_project = await Employee_Project.findAll({
            include: [
                {
                    model: Employee,
                    where: { userId: request.params.id }
                },
                {
                    model: Project,
                    attributes: ['name']
                }
            ]
        });

        if (employee_project) {
            response.json(employee_project);
        } else {
            response.status(404).send("Employee's projects not found");
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

module.exports = router