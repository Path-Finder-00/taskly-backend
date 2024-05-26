const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('roles', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            role: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        })
        await queryInterface.addColumn('employee_projects', 'role_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'roles', key: 'id' }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('roles')
    }
}