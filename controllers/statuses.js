const router = require('express').Router()

const { Status } = require('../models')

router.get('/', async (request, response) => {
    const statuses = await Status.findAll()

    response.json(statuses)
})

module.exports = router
