const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('employees_projects', 'manager', {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('employees_projects', 'manager')
    }
}