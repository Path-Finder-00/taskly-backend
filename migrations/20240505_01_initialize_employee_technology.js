const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('employee_technologies', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'employees', key: 'id' }
            },
            technology_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'technologies', key: 'id' }
            },
            
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('employee_technologies')
    }
}