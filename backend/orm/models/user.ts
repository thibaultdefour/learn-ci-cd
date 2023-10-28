import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import Collection from './collection.js'

@Table
export default class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @Column
    username: string

    @Column
    password: string

    @Column
    email: string

    @Column
    admin: boolean

    @HasMany(() => Collection, { onDelete: 'CASCADE', foreignKey: 'ownerId' })
    collections: Collection[]
}
