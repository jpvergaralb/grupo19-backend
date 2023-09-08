const sequelize = require('../db/db')
const { Model, DataTypes } = require('sequelize')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Username cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
            msg: 'Password must be at least 8 characters long and contain at least one number, one letter, and one special character.'
          }          
        }
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Email must be a valid email address"
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "First name cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Last name cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Phone number cannot be empty"
            },
            len: {
                args: [8],
                msg: "Phone number must be 10 digits long"
            }
        }
    }
}, 
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true
    }
)

module.exports = User