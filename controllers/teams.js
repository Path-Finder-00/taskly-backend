const router = require('express').Router()

const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

const { Team, Employee, Employment_History } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/members', tokenExtractor,  async (request, response, next) => {
    try {
        Employee.findAll({
            include: [
                {
                    model: Employment_History,
                    include: [
                        {
                            model: Team,
                            required: true,
                            attributes: []
                        }
                    ],
                    where: {
                        team_id: {
                            [Op.in]: sequelize.literal(`(
                                SELECT team_id
                                FROM employment_histories
                                WHERE employee_id = ${request.decodedToken.id}
                                AND employment_histories.to IS NULL
                            )`)
                        }
                    },
                    attributes: []
                }
            ]
        }).then(employees => {
            response.json(employees)
        })
    } catch(error) {
        next(error)
    }
})

module.exports = router