const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
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
        //{ expiresIn: 60*60 }
    )
    
    // Because currently the token doesn't expire (look above), the token will only become 
    // obsolete after being logged out (to be implemented) or after having one's rights access revoked
    // (also to be implemented). Later however it will be necessary to delete the token from the db
    // after it expires.
    await Session.create({ token: token, userId: user.id })

    response
        .status(200)
        .send({ token, id: user.id, email: user.email, name: user.name })
})

module.exports = router