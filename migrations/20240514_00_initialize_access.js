const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('accesses', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        })
        await queryInterface.addColumn('users', 'access_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'accesses', key: 'id' }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('accesses')
    }
}