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
const User_Ticket = require('./user_ticket')
const Technology = require('./technology')
const Employee_Technology = require('./employee_technology')
const Organization = require('./organization')
const Comment = require('./comment')
const Attachment = require('./attachment')
const Access = require('./access')
const Permission = require('./permission')
const Access_Permission = require('./access_permission')

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

Ticket.belongsTo(Project)
Project.hasMany(Ticket)

Ticket.belongsToMany(Employee, { through: Ticket_History })
Employee.belongsToMany(Ticket, { through: Ticket_History })
User.belongsToMany(Ticket, { through: User_Ticket})
Ticket.belongsToMany(User, { through: User_Ticket})
User_Ticket.belongsTo(User)
User_Ticket.belongsTo(Ticket)
Ticket.hasMany(User_Ticket)
User.hasMany(User_Ticket)
Ticket_History.belongsTo(Employee)
Ticket_History.belongsTo(Ticket)
Ticket.hasMany(Ticket_History)
Employee.hasMany(Ticket_History)

Ticket_History.belongsTo(Ticket)
Ticket.hasMany(Ticket_History)

Ticket_History.belongsTo(Status)
Status.hasMany(Ticket_History)

Ticket_History.belongsTo(Priority)
Priority.hasMany(Ticket_History)

Ticket.belongsTo(Type)
Type.hasMany(Ticket)

Technology.belongsToMany(Employee, { through: Employee_Technology })
Employee.belongsToMany(Technology, { through: Employee_Technology })

Employee_Technology.belongsTo(Technology)
Employee_Technology.belongsTo(Employee)

Employee.hasMany(Employee_Technology)
Technology.hasMany(Employee_Technology)

Organization.hasMany(Team)
Team.belongsTo(Organization)

Organization.hasMany(User)
User.belongsTo(Organization)


Ticket.belongsToMany(User, { through: Comment })
User.belongsToMany(Ticket, { through: Comment })
Comment.belongsTo(Ticket)
Comment.belongsTo(User)
Ticket.hasMany(Comment)
User.hasMany(Comment)

Ticket.belongsToMany(User, { through: Attachment })
User.belongsToMany(Ticket, { through: Attachment })
Attachment.belongsTo(Ticket)
Attachment.belongsTo(User)
Ticket.hasMany(Attachment)
User.hasMany(Attachment)

User.belongsTo(Access)
Access.hasMany(User)

Permission.belongsToMany(Access, { through: Access_Permission })
Access.belongsToMany(Permission, { through: Access_Permission })
Access_Permission.belongsTo(Permission)
Access_Permission.belongsTo(Access)
Permission.hasMany(Access_Permission)
Access.hasMany(Access_Permission)

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
    Type,
    User_Ticket,
    Technology,
    Employee_Technology,
    Organization,
    Comment,
    Attachment,
    Access,
    Permission,
    Access_Permission
} 