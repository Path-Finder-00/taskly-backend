const router = require('express').Router()

const { Priority } = require('../models')

router.get('/', async (request, response) => {
    const priorities = await Priority.findAll()

    response.json(priorities)
})

module.exports = router