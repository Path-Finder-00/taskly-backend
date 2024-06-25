const router = require('express').Router()

const { Technology } = require('../models')

router.get('/', async (request, response) => {
    const technologies = await Technology.findAll()

    response.json(technologies)
})

module.exports = router
