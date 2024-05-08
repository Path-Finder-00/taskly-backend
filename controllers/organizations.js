const router = require('express').Router()

const { Organization } = require('../models')

router.get('/', async (request, response) => {
    const organizations = await Organization.findAll()

    response.json(organizations)
})

module.exports = router