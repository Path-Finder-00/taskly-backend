const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Team, Employee, User, Employment_History } = require('../models')
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

module.exports = router