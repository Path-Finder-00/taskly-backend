const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Access_Permission extends Model {}

Access_Permission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'accesses', key: 'id' }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'permissions', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'access_permission'
})

module.exports = Access_Permission