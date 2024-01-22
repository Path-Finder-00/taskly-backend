const Project = require('./project')
const Employee = require('./employee')
const User = require('./user')
const Session = require('./session')
const Role = require('./role')
const Employee_Project = require('./employee_project')

Employee.belongsToMany(Project, { through: Employee_Project })
Project.belongsToMany(Employee, { through: Employee_Project })
Employee_Project.belongsTo(Employee)
Employee_Project.belongsTo(Project)
Employee.hasMany(Employee_Project)
Project.hasMany(Employee_Project)

Employee_Project.hasOne(Role)
Role.belongsTo(Employee_Project)

User.hasOne(Session)
Session.belongsTo(User)

User.hasOne(Employee)
Employee.belongsTo(User)

module.exports = {
    Project, 
    Employee,
    User,
    Session,
    Role,
    Employee_Project
}