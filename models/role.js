const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Role extends Model {}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'role'
})

module.exports = Role