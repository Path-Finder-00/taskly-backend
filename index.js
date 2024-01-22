const express = require('express')
require('express-async-errors')
const app = express()

const middleware = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const projectsRouter = require('./controllers/projects')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')

app.use(express.json())

app.use('/api/projects', projectsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()