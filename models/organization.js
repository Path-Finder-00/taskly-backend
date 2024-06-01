const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Organization extends Model {}

Organization.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'organization'
})

module.exports = Organization