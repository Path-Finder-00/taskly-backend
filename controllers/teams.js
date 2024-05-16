const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Team, Employee, User, Employment_History, Organization_Team } = require('../models')
const { tokenExtractor } = require('../util/middleware')

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
                                }
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

router.post('/', tokenExtractor, async (request, response) => {

    try {
        const user = await User.findByPk(request.decodedToken.id)
        if (user.access_id === 1) {
            const team = await Team.create({
                name: request.body.name
            })
            const organization_team = await Organization_Team.create({
                organizationId: request.body.organization,
                teamId: team.id
            })

            response.json(team);
        } else {
            return response.status(403).message("You need at least Admin privileges to create a team.")
        }

    } catch (error) {
        console.log(error)
        return response.status(400).json({ error })
    }
})

module.exports = router