const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('employment_histories', {
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
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'employees', key: 'id' }
            },
            team_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'teams', key: 'id' }
            },
            
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('employment_histories')
    }
}