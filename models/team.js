const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'team'
})

module.exports = Team