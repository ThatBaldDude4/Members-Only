try {
    process.loadEnvFile();
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
}

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

module.exports = { prisma };