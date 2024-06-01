const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Type extends Model {}

Type.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'type'
})

module.exports = Type