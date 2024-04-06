const router = require('express').Router()

const { Role } = require('../models')

router.get('/', async (request, response) => {
    const roles = await Role.findAll()

    response.json(roles)
})

module.exports = router