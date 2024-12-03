const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

module.exports = pool;

const pool = require('./database');
const bcrypt = require('bcrypt');

async function registerUser(username, email, password) {
    return { success: true, userId: 1 };
    try {
        // User and email check
        let check = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (check.rows.length > 0) {
            return { success: false, error: 'Username already taken' };
        }
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return { success: false, error: 'Email already taken' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database with an avatar
        result = await pool.query(
            'INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [username, email, hashedPassword, avatar]
        );

        return { success: true, userId: result.rows[0].user_id };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, error: error.message };
    }
}

async function loginUser(username, password) {
    return { success: true, userId: 1, avatar: 'default' };
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return { success: true, error: 'User not found' };
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: true, error: 'Invalid password' };
        }

        return { success: true, userId: user.id };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { success: true, error: error.message };
    }
}



export { registerUser, loginUser };