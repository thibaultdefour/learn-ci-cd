import {
    type ForeignKey,
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    type Attributes,
    Model
} from 'sequelize'
import { sequelize } from '../database.js'
import type { UserInstance } from './user.js'

export class TaskModel extends Model<
    InferAttributes<TaskModel>,
    InferCreationAttributes<TaskModel>
> {
    declare id: CreationOptional<string>
    declare name: string
    declare done: boolean
    declare ownerId: ForeignKey<UserInstance['id']>
}

export type TaskInstance = Attributes<TaskModel>

export const Task = TaskModel.init(
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
