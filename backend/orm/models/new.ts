// import { Table, Column, Model, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'
//
// @Table
// export class User extends Model {
//     @IsUUID(4)
//     @PrimaryKey
//     @Column
//     id: string
//
//     @Column
//     username: string
//
//     @Column
//     password: string
//
//     @Column
//     email: string
//
//     @Column
//     admin: boolean
// }
// @Table
// export class Task extends Model {
//     @IsUUID(4)
//     @PrimaryKey
//     @Column
//     id: string
//
//     @Column
//     name: string
//
//     @Column
//     done: boolean
//
//     @ForeignKey(() => User)
//     ownerId: Date
// }
//
