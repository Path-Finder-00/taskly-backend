const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Employment_History extends Model {}

Employment_History.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    since: {
        type: DataTypes.DATE,
        allowNull: false
    },
    to: {
        type: DataTypes.DATE
    },
    team_lead: {
        type: DataTypes.BOOLEAN
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }
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
    modelName: 'employment_history'
})

module.exports = Employment_History