const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Access extends Model {}

Access.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'access'
})

module.exports = Access