const router = require('express').Router()

const { User, Employee, Project } = require('../models')
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
router.get('/:id', async (request, response, next) => {
    try {
        const project = await Project.findOne({
            where: { id: request.params.id },
        });

        if (project) {
            response.json(project);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router