const { Pool } = require("pg");

const {
    USER,
    PASSWORD,
    HOST,
    DB_PORT,
    DATABASE,
} = process.env;

const connectString = process.env.DATABASE_URL ?? `postgresql://${USER}:${PASSWORD}@${HOST}:${DB_PORT}/${DATABASE}`;

const pool = new Pool({
    connectionString: connectString
})

module.exports = pool;