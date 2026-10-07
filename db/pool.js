const { Pool } = require("pg");

try {
    process.loadEnvFile();
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
}

const {
    USER,
    PASSWORD,
    HOST,
    PORT,
    DATABASE,
} = process.env;

const connectString = process.env.DATABASE_URL ?? `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

const pool = new Pool({
    connectionString: connectString
})

module.exports = pool;