import {
    DataTypes,
    Model,
    type NonAttribute,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes
} from 'sequelize'
import { sequelize } from '../database.js'
import type { TaskInstance } from './task.js'

export class UserInstance extends Model<
    InferAttributes<UserInstance>,
    InferCreationAttributes<UserInstance>
> {
    declare id: CreationOptional<number>
    declare username: string
    declare email: string
    declare password: string
    declare admin: boolean

    declare tasks?: NonAttribute<TaskInstance[]>
}

export const User = UserInstance.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                isBoolean: true
            }
        }
    },
    {
        sequelize,
        tableName: 'users'
    }
)
