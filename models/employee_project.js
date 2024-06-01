const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Employee_Project extends Model {}

Employee_Project.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    since: {
        type: DataTypes.DATE,
        allowNull: false
    },
    to: {
        type: DataTypes.DATE
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' }
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'employee_project'
})

module.exports = Employee_Project