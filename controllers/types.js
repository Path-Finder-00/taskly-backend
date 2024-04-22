const router = require('express').Router()

const { Type } = require('../models')

router.get('/', async (request, response) => {
    const priorities = await Type.findAll()

    response.json(priorities)
})

module.exports = router