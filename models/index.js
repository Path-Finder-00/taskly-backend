const Project = require('./project')
const Employee = require('./employee')
const User = require('./user')
const Session = require('./session')
const Role = require('./role')
const Employee_Project = require('./employee_project')
const Team = require('./team')
const Employment_History = require('./employment_history')
const Ticket = require('./ticket')
const Ticket_History = require('./ticket_history')
const Priority = require('./priority')
const Status = require('./status')
const Type = require('./type')

Employee.belongsToMany(Project, { through: Employee_Project })
Project.belongsToMany(Employee, { through: Employee_Project })
Employee_Project.belongsTo(Employee)
Employee_Project.belongsTo(Project, { as: 'Proj' })
Employee.hasMany(Employee_Project, { as: 'EmpProj' })
Project.hasMany(Employee_Project)

Employee_Project.belongsTo(Role)
Role.hasMany(Employee_Project)

User.hasOne(Session)
Session.belongsTo(User)

User.hasOne(Employee, { as: 'Emp' })
Employee.belongsTo(User)

Team.belongsToMany(Employee, { through: Employment_History })
Employee.belongsToMany(Team, { through: Employment_History })
Employment_History.belongsTo(Team)
Employment_History.belongsTo(Employee)
Team.hasMany(Employment_History)
Employee.hasMany(Employment_History)

Ticket.belongsTo(Project)
Project.hasMany(Ticket, { as: 'ProjTickets' })

Ticket.belongsToMany(Employee, { through: Ticket_History })
Employee.belongsToMany(Ticket, { through: Ticket_History })
Ticket_History.belongsTo(Employee)
Ticket_History.belongsTo(Ticket)
Ticket.hasMany(Ticket_History)
Employee.hasMany(Ticket_History)

Ticket_History.belongsTo(Ticket)
Ticket.hasMany(Ticket_History, { as: 'TickHist' })

Ticket_History.belongsTo(Status, { as: 'TickStatus' })
Status.hasMany(Ticket_History)

Ticket_History.belongsTo(Priority, { as: 'TickPriority' })
Priority.hasMany(Ticket_History)

Ticket.belongsTo(Type, { as: 'TicketType' })
Type.hasMany(Ticket)


module.exports = {
    Project, 
    Employee,
    User,
    Session,
    Role,
    Employee_Project,
    Team,
    Employment_History,
    Ticket,
    Ticket_History,
    Priority,
    Status,
    Type
} 