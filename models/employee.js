const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Employee extends Model {}

Employee.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'employee'
})

module.exports = Employee