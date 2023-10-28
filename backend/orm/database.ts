import { Sequelize } from 'sequelize-typescript'
import Collection from './models/collection.js'
import Task from './models/task.js'
import User from './models/user.js'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: [Collection, User, Task]
})

sequelize.sync().then(async () => {
    // await Task.destroy({ where: {} })
    // await Collection.destroy({ where: {} })
    // await User.destroy({ where: {} })

    const userAlice = await User.create({
        id: '1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e',
        username: 'alice',
        email: 'alice@example.com',
        password: 'azerty',
        admin: false
    })
    //
    const collection = await Collection.create({
        name: 'Lorem ipsum',
        ownerId: userAlice.id
    })

    // collection.reload()

    await Task.create({
        name: 'Lorem ipsum',
        done: false,
        collectionId: collection.id
    })
})
