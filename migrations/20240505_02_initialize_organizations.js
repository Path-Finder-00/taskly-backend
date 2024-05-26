const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('organizations', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        })
        await queryInterface.addColumn('teams', 'organization_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'organizations', key: 'id' }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('organizations')
    }
}