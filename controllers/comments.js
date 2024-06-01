const router = require('express').Router()

const { User, Ticket, Comment } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/:id', tokenExtractor, async (request, response) => {

    const ticket = await Ticket.findOne({
        where: {
            id: request.params.id
        },
        include: [
            {
                model: Comment,
                include: [
                    {
                        model: User,
                        attributes: ['name', 'surname']
                    }
                ]
            }
        ],
        order: [
            [
                {
                    model: Comment,
                },
                'createdAt',
                'DESC'
            ]
        ]
    })
    response.json(ticket.comments)
})


router.post('/:id', tokenExtractor, async (request, response) => {

    try {
        const comment = await Comment.create({
            userId: request.decodedToken.id,
            ticketId: request.params.id,
            comment: request.body.comment
        })

        const newComment = await Comment.findOne({
            where: {
                id: comment.id
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'surname']
                }
            ]
        })

        response.json(newComment)
    } catch (error) {
        return response.status(400).json({ error })
    }
})

module.exports = router