const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Not an email."
            }
        }
    },
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        // TODO: shall we consider country codes? e.g. 123456789, +1123456789, +12123456789, +123123456789, +1234123456789 are valid; 1234567890 is not valid
        validate: {
            isPhoneNumber(phoneNumber) {
                const phoneNumberPattern = /^(?:\+\d{1,4}[0-9]{0,9}|\d{9})$/;
                if (!phoneNumberPattern.test(phoneNumber)) {
                    throw new Error("Not a phone number.")
                }
            }
        }
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
})

module.exports = User