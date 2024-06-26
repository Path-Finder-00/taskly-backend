const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Team, Employee, User, Employment_History } = require('../models')
const { tokenExtractor, checkPermissions } = require('../util/middleware')

router.get('/members', tokenExtractor, async (request, response, next) => {
    try {
        User.findAll({
            include: [
                {
                    model: Employee,
                    required: true,
                    include: [
                        {
                            model: Employment_History,
                            attributes: [],
                            include: [
                                {
                                    model: Team,
                                    attributes: [],
                                    required: true
                                }
                            ],
                            where: {
                                team_id: {
                                    [Op.in]: sequelize.literal(`(
                                        SELECT team_id
                                        FROM employment_histories
                                        WHERE employee_id = (
                                            SELECT id
                                            FROM employees
                                            WHERE user_id = ${request.decodedToken.id}
                                        )
                                        AND employment_histories.to IS NULL
                                    )`)
                                },
                                to: null
                            }
                        }
                    ]
                }
            ],
            attributes: { exclude: ['passwordHash'] }
        }).then(employees => {
            response.json(employees)
        })
    } catch (error) {
        next(error)
    }
})

router.get('/teamNames', tokenExtractor, async (request, response) => {
    try {
        const user = await User.findByPk(request.decodedToken.id)

        const users = await User.findAll({
            where: {
                organizationId: user.organizationId
            },
            attributes: ['id'],
            include: [
                {
                    model: Employee,
                    required: true,
                    attributes: ['id'],
                    include: {
                        model: Team,
                        through: {
                            model: Employment_History,
                            where: { to: null }
                        },
                        attributes: ['name']
                    }
                }
            ]
        })

        const teamNames = users.map(user => user.employee.teams[0] ? { id: user.id, teamName: user.employee.teams[0].name } : { id: user.id, teamName: '' })

        response.json(teamNames)
    } catch (error) {
        console.log(error)
        return response.status(400).json({ error })
    }
})

router.post('/', tokenExtractor, checkPermissions(['createTeam']), async (request, response) => {

    try {
        const user = await User.findByPk(request.decodedToken.id)

        const team = await Team.create({
            name: request.body.name,
            organizationId: request.body.organization
        })

        response.json(team);

    } catch (error) {
        console.log(error)
        return response.status(400).json({ error })
    }
})

module.exports = router
