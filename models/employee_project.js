const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Employee_Project extends Model {}

Employee_Project.init({
    since: {
        type: DataTypes.DATE,
        allowNull: false
    },
    to: {
        type: DataTypes.DATE
    },
    manager: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'employee_project'
})

module.exports = Employee_Project