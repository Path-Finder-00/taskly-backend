const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Employee_Technology extends Model {}

Employee_Technology.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }
    },
    technologyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'technologies', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'employee_technology'
})

module.exports = Employee_Technology