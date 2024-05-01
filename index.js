const express = require('express')
const cors = require('cors')
require('express-async-errors')
const app = express()

const middleware = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const projectsRouter = require('./controllers/projects')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const rolesRouter = require('./controllers/roles')
const teamsRouter = require('./controllers/teams')
const ticketsRouter = require('./controllers/tickets')
const prioritiesRouter = require('./controllers/priorities')
const typesRouter = require('./controllers/types')
const statusesRouter = require('./controllers/statuses')
// const employeesRouter = require('./controllers/employees')
const ticketHistoriesRouter = require('./controllers/ticket_histories')

app.use(express.json())
app.use(cors())

app.use('/api/projects', projectsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/priorities', prioritiesRouter)
app.use('/api/types', typesRouter)
app.use('/api/statuses', statusesRouter)
// app.use('/api/employees', employeesRouter)
app.use('/api/ticket_histories', ticketHistoriesRouter)

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()