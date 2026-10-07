const { Client } = require("pg");

try {
    process.loadEnvFile();
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
};

const {
    USER,
    PASSWORD,
    HOST,
    PORT,
    DATABASE,
} = process.env;

const connectString = process.env.DATABASE_URL ?? `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

const usersSQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        member_status VARCHAR(255) NOT NULL,
        salt TEXT NOT NULL,
        hash TEXT NOT NULL
    );
`;

const postsSql = `
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
    );
`;

async function createTables() {
    const client = new Client({
        connectionString: connectString,
    });

    console.log("Creating tables...");
    try {
        await client.connect();
        await client.query(usersSQL);
        await client.query(postsSql);
        console.log("done");
    }finally {
        await client.end();
    }
};

async function deleteAllTables() {
    const SQL = `
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
    `;
    const client = new Client({
        connectionString: connectString,
    });

    console.log("Deleting tables...");
    try {
        await client.connect();
        await client.query(SQL);
        console.log("done");
    }finally {
        await client.end();
    }
}