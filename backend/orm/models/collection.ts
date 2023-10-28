// import {
//     type ForeignKey,
//     type CreationOptional,
//     DataTypes,
//     type InferAttributes,
//     type InferCreationAttributes,
//     Model
// } from 'sequelize'
// import { sequelize } from '../database.js'
// import type { UserInstance } from './user.js'
//
//
// export type TaskInstance = {
//     id: string
//     name: string
//     done: boolean
//     ownerId: string
// }
//
// export class TaskModel extends Model<
//     InferAttributes<TaskModel>,
//     InferCreationAttributes<TaskModel>
// > {
//     declare id: CreationOptional<string>
//     declare name: string
//     declare done: boolean
//     declare ownerId: ForeignKey<UserInstance['id']>
// }
//
// // export function getAttributeMetadata<M extends Model>(
// //     model: ModelStatic<M>,
// //     attributeName: keyof Attributes<M>
// // ) {
// //     if (attributeName in model.rawAttributes) {
// //         return model.rawAttributes[attributeName]
// //     }
// //
// //     throw new Error(`Attribute ${attributeName} does not exist on model ${model.name}`)
// // }
// //
// // const x = getAttributeMetadata(TaskModel, 'id')
//
// export const Task = TaskModel.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             allowNull: false,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         done: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         ownerId: {
//             type: DataTypes.UUID,
//             allowNull: false
//         }
//     },
//     { sequelize, tableName: 'tasks' }
// )

import {
    HasMany,
    Column,
    Model,
    PrimaryKey,
    Table,
    ForeignKey,
    BelongsTo,
    Default,
    DataType
} from 'sequelize-typescript'
import Task from './task.js'
import User from './user.js'

console.log('c')

@Table
export default class Collection extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @Column
    name: string

    @ForeignKey(() => User)
    @Column
    ownerId: string

    @BelongsTo(() => User)
    owner: Awaited<User>

    @HasMany(() => Task, { onDelete: 'CASCADE', foreignKey: 'collectionId' })
    tasks: Task[]
}
