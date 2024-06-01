const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Status extends Model {}

Status.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'status'
})

module.exports = Status