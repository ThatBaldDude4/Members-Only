const pool = require("./pool");

async function addNewUser({first_name, last_name, username, hashedPassword}) {
    await pool.query(`
        INSERT INTO users 
        (first_name, last_name, username, member_status, hash) 
        VALUES ($1, $2, $3, $4, $5);
        `, [first_name, last_name, username, null, hashedPassword]);
}

async function addNewPost({title, message, user_id}) {
    await pool.query(`
        INSERT INTO posts
        (title, message, user_id)
        VALUES ($1, $2, $3);
    `, [title, message, user_id])
};

async function deletePost(id) {
    await pool.query(`
        DELETE FROM posts
        WHERE id = $1;
    `, [id])
}

async function getAllPosts() {
    const { rows } = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON users.id = posts.user_id;');
    return rows;
}

async function updateMembership(id, status) {
    await pool.query(`
        UPDATE users
        SET member_status = $1
        WHERE id = $2;
    `, [status, id])
}

module.exports = {
    addNewUser,
    addNewPost,
    deletePost,
    getAllPosts,
    updateMembership
}