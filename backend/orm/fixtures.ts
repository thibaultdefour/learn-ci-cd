import { usePrisma } from './database.js'

const prisma = usePrisma()

export async function regenerateFixtures() {
    // await prisma.collection.deleteMany({ where: {} })
    // await prisma.task.deleteMany({ where: {} })
    // await prisma.user.deleteMany({ where: {} })

    const userAlice = await prisma.user.create({
        data: {
            username: 'Alice' + Date.now(),
            email: 'alice@prisma.io' + Date.now(),
            password: '',
            admin: false
        }
    })

    const aliceCollection = await prisma.collection.create({
        data: {
            name: 'My collection',
            ownerId: userAlice.id
        }
    })

    const aliceTask = await prisma.task.create({
        data: {
            name: 'dfsdf',
            done: false,
            collectionId: aliceCollection.id
        }
    })

    const tasks = await prisma.user.findMany({
        include: {
            collections: {
                include: {
                    tasks: true
                }
            }
        }
    })
}
