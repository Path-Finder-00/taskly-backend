const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
    const { email, password } = request.body

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid username or password.'
        })
    }

    const userForToken = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )
    
    await Session.create({ token: token, userId: user.id })

    response
        .status(200)
        .send({ token, id: user.id, email: user.email, name: user.name })
})

module.exports = router
