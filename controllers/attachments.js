const router = require('express').Router()
const path = require('path')
const multer = require('multer')

const { User, Ticket, Attachment } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/all/:id', tokenExtractor, async (request, response) => {

    const ticket = await Ticket.findOne({
        where: {
            id: request.params.id
        },
        include: [
            {
                model: Attachment,
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
                    model: Attachment,
                },
                'createdAt',
                'DESC'
            ]
        ]
    })
    response.json(ticket.attachments)
})

router.get('/:id/:name', tokenExtractor, async (request, response) => {

    const file = path.join("/data", request.params.id, request.params.name)

    response.download(file)
})


router.post('/:id', tokenExtractor, async (request, response) => {

    try {

        const mnt = "/data"
        const dir = request.params.id

        const storage = multer.diskStorage({
            destination: path.join(mnt, dir),
            filename: function (request, file, cb) {
                cb(
                    null,
                    file.originalname
                )
            }
        })

        const upload = multer({
            storage: storage,
            limits: { fileSize: 10000000 }
        }).single("file")

        upload(request, response, async (err) => {
            if (err) {
                response.status(300).json(err)
            } else {
                if (request.file == undefined) {
                    response.status(301).json("Failed to upload the file")
                } else {
                    const attachment = await Attachment.create({
                        userId: request.decodedToken.id,
                        ticketId: request.params.id,
                        name: request.body.name,
                        description: request.body.description
                    })
            
                    const newAttachment = await Attachment.findOne({
                        where: {
                            id: attachment.id
                        },
                        include: [
                            {
                                model: User,
                                attributes: ['name', 'surname']
                            }
                        ]
                    })
                    response.status(200).json(newAttachment)
                }
            }
        })
    } catch (error) {
        return response.status(400).json({ error })
    }
})

module.exports = router
