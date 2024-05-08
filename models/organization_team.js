const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Organization_Team extends Model {}

Organization_Team.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'id' }
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'organization_team'
})

module.exports = Organization_Team