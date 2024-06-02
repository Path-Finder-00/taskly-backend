const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('teams', {
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
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('teams')
    }
}