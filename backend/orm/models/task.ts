import {
    type ForeignKey,
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model
} from 'sequelize'
import { sequelize } from '../database.js'
import type { UserInstance } from './user.js'

export class TaskInstance extends Model<
    InferAttributes<TaskInstance>,
    InferCreationAttributes<TaskInstance>
> {
    declare id: CreationOptional<number>
    declare name: string
    declare done: boolean
    declare ownerId: ForeignKey<UserInstance['id']>
}

export const Task = TaskInstance.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    { sequelize, tableName: 'tasks' }
)
