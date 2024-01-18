const Project = require('./project')
const Employee = require('./employee')
const Employee_Project = require('./employee_project')

Employee.belongsToMany(Project, { through: Employee_Project })
Project.belongsToMany(Employee, { through: Employee_Project })