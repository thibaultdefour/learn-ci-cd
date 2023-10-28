import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany()

    const userAlice = await prisma.user.create({
        data: {
            username: 'Alice',
            email: 'alice@prisma.io',
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

    console.log(tasks[0].collections[0].tasks[0].name)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async (e) => {
        console.error(e)

        await prisma.$disconnect()

        process.exit(1)
    })
