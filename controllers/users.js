const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')

router.post('/', async (request, response) => {
    const { name, surname, email, password, phone } = request.body

    if (password.length < 8) {
        return response.status(400).json({
            error: 'Password has to be at least 8 characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
        name: name,
        surname: surname,
        email: email,
        passwordHash: passwordHash,
        phone: phone
    })

    response.status(201).json(user)
})

module.exports = router