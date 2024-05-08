const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('organization_teams', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            organization_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'organizations', key: 'id' }
            },
            team_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'teams', key: 'id' }
            },
            
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('organization_teams')
    }
}