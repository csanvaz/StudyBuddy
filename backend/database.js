const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

//change to ssl: false for local development
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false 
    //ssl: { rejectUnauthorized: false }
  });

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

async function registerUser(username, email, password) {
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
            [username, email, hashedPassword, username]
        );

        return { success: true, userId: result.rows[0].user_id };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, error: error.message };
    }
}

async function loginUser(username, password) {
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return { success: false, error: 'User not found' };
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: false, error: 'Invalid password' };
        }
        return { success: true, userId: user.user_id, avatar: user.avatar };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { success: false, error: error.message };
    }
}

async function validatePassword(userId, password) {
    try {
        // Find the user by userId
        const result = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return { success: false, error: 'User not found' };
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: false, error: 'Invalid password' };
        }
        return { success: true };
    } catch (error) {
        console.error('Error validating password:', error);
        return { success: false, error: error.message };
    }
}

async function testDatabaseConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        return { success: true, time: result.rows[0].now };
    } catch (error) {
        console.error('Error testing database connection:', error);
        return { success: false, error: error.message };
    }
}

async function addContent(title, text_id, is_quiz, data) {
    try {
        const result = await pool.query(
            'INSERT INTO content (title, text_id, is_quiz, data) VALUES ($1, $2, $3, $4) RETURNING content_id',
            [title, text_id, is_quiz, data]
        );
        return { success: true, contentId: result.rows[0].content_id };
    } catch (error) {
        console.error('Error adding content:', error);
        return { success: false, error: error.message };
    }
}

async function updateAvatar(userId, avatar) {
    try {
        await pool.query('UPDATE users SET avatar = $1 WHERE user_id = $2', [avatar, userId]);
        return { success: true, message: 'Avatar updated successfully' };
    } catch (error) {
        console.error('Error updating avatar:', error);
        return { success: false, error: error.message };
    }
}

async function getUserContent(userId) {
    try {
        const result = await pool.query('SELECT * FROM content WHERE user_id = $1', [userId]);
        return { success: true, content: result.rows };
    } catch (error) {
        console.error('Error fetching user content:', error);
        return { success: false, error: error.message };
    }
}

async function createContent(userId, title, text_id, is_quiz, data) {
    try {
        const result = await pool.query(
            'INSERT INTO content (user_id, title, text_id, is_quiz, data) VALUES ($1, $2, $3, $4, $5) RETURNING content_id',
            [userId, title, text_id, is_quiz, data]
        );
        return { success: true, contentId: result.rows[0].content_id };
    } catch (error) {
        console.error('Error creating content:', error);
        return { success: false, error: error.message };
    }
}

async function setLoginNow(userId) {
    try {
        await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [userId]);
        console.log(`User ${userId} login time set to now`);
    } catch (error) {
        console.error('Error setting login time:', error);
    }
}

async function getShopItems() {
    try {
        const result = await pool.query('SELECT * FROM shop_items'); // Query the shop_items table
        return { success: true, items: result.rows }; // Return the rows (shop items)
    } catch (error) {
        console.error('Error fetching shop items:', error);
        return { success: false, error: error.message };
    }
}

async function getGold(userName) {
    try {
        const result = await pool.query('SELECT gold FROM users WHERE username = $1', [userName]);
        if (result.rows.length > 0) {
            return { success: true, gold: result.rows[0].gold }; // Return the gold of the user
        } else {
            return { success: false, message: 'User not found' };
        }
    } catch (error) {
        console.error('Error fetching gold:', error);
        return { success: false, error: error.message };
    }
}

// Update the user's gold in the database
async function updateGold(userName, goldEarned) {
    try {
        const result = await pool.query(
            'UPDATE users SET gold = gold + $1 WHERE username = $2 RETURNING gold',
            [goldEarned, userName]
        );
        if (result.rows.length > 0) {
            return { success: true, gold: result.rows[0].gold }; // Return the updated gold
        } else {
            return { success: false, message: 'User not found' };
        }
    } catch (error) {
        console.error('Error updating gold:', error);
        return { success: false, error: error.message };
    }
}

async function deleteContent(contentId) {
    try {
        // First, delete associated flashcards
        await pool.query('DELETE FROM flashcards WHERE content_id = $1', [contentId]);

        // Then, delete the content itself
        await pool.query('DELETE FROM content WHERE content_id = $1', [contentId]);

        return { success: true, message: 'Content and associated flashcards deleted successfully' };
    } catch (error) {
        console.error('Error deleting content:', error);
        return { success: false, error: error.message };
    }
}


module.exports = {
    pool,
    registerUser,
    loginUser,
    validatePassword,
    testDatabaseConnection,
    addContent,
    updateAvatar,
    getUserContent,
    createContent,
    setLoginNow,
    getShopItems,
    getGold,
    updateGold
  };
