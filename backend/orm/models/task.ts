import {
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import Collection from './collection.js'

@Table
export default class Task extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @Column
    name: string

    @Column
    done: boolean

    @ForeignKey(() => Collection)
    @Column(DataType.UUID)
    collectionId: string

    @BelongsTo(() => Collection)
    collection: Awaited<Collection>
}
