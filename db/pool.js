const { Pool } = require("pg");

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