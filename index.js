const express = require('express')
const cors = require('cors')
const { expressCspHeader, NONE, SELF, INLINE } = require('express-csp-header')
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
const employeesRouter = require('./controllers/employees')
const ticketHistoriesRouter = require('./controllers/ticket_histories')
const technologiesRouter = require('./controllers/technologies')
const organizationsRouter = require('./controllers/organizations')
const employmentHistoriesRouter = require('./controllers/employment_histories')
const employeeProjectsRouter = require('./controllers/employee_projects')
const commentsRouter = require('./controllers/comments')
const attachmentsRouter = require('./controllers/attachments')
const permissionsRouter = require('./controllers/permissions')
const logoutRouter = require('./controllers/logout')

app.use(express.json())
app.use(cors())

app.use(expressCspHeader({
  directives: {
    'default-src': [SELF],
    'img-src': [SELF],
    'script-src': [SELF, INLINE],
    'style-src': [SELF, INLINE],
    'connect-src': [SELF],
    'font-src': [SELF],
    'object-src': [NONE],
    'media-src': [SELF],
    'frame-src': [NONE]
  }
}));

app.use(express.static('dist'))

app.use('/api/projects', projectsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/priorities', prioritiesRouter)
app.use('/api/types', typesRouter)
app.use('/api/statuses', statusesRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/ticket_histories', ticketHistoriesRouter)
app.use('/api/technologies', technologiesRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/employment_histories', employmentHistoriesRouter)
app.use('/api/employee_projects', employeeProjectsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/attachments', attachmentsRouter)
app.use('/api/permissions', permissionsRouter)
app.use('/api/logout', logoutRouter)

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()