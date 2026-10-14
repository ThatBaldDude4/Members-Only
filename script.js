import { prisma } from "./lib/prisma.js";


async function main() {
    try {
        const user = await prisma.user.create({
        data: {
            first_name: "Brendan",
            last_name: "Vannattan",
            username: "bvannattan04",
            email: "bvannattan@gmail.com",
            hash: "lasdfkasdjf"
        },
        include: {
            posts: false
        }
    });
        console.log("Created user: ", user);
    }catch(err) {
        console.error(err);
    }

    const allUsers = await prisma.user.findMany({
        include: {
            posts: true
        }
    });
    console.log("All users:", JSON.stringify(allUsers, null, 2));
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });