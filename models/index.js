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

Employee.belongsToMany(Project, { through: Employee_Project })
Project.belongsToMany(Employee, { through: Employee_Project })
Employee_Project.belongsTo(Employee)
Employee_Project.belongsTo(Project)
Employee.hasMany(Employee_Project)
Project.hasMany(Employee_Project)

Employee_Project.belongsTo(Role)
Role.hasMany(Employee_Project)

User.hasOne(Session)
Session.belongsTo(User)

User.hasOne(Employee)
Employee.belongsTo(User)

Team.belongsToMany(Employee, { through: Employment_History })
Employee.belongsToMany(Team, { through: Employment_History })
Employment_History.belongsTo(Team)
Employment_History.belongsTo(Employee)
Team.hasMany(Employment_History)
Employee.hasMany(Employment_History)

Ticket.belongsToMany(Employee, { through: Ticket_History })
Employee.belongsToMany(Ticket, { through: Ticket_History })
Ticket_History.belongsTo(Employee)
Ticket_History.belongsTo(Ticket)
Ticket_History.belongsTo(Status)
Ticket_History.belongsTo(Priority)
Status.hasOne(Ticket_History)
Priority.hasOne(Ticket_History)
Ticket.hasMany(Ticket_History)
Employee.hasMany(Ticket_History)
Project.hasMany(Ticket)
Ticket.belongsTo(Project)

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
    Status
} 