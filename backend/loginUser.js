const pool = require('../db'); // Adjust path as needed

async function loginUser(username, password) {
    try {
        // Query to check if the user exists and fetch password and other details
        const result = await pool.query('SELECT user_id, password FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return { success: false, error: 'User not found' };
        }

        const user = result.rows[0];
        // Verify the password (use a hashing library like bcrypt if passwords are hashed)
        if (password === user.password) { // Replace this comparison with bcrypt.compare if hashed
            return { success: true, userId: user.user_id };
        } else {
            return { success: false, error: 'Incorrect password' };
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        return { success: false, error: 'An error occurred during login' };
    }
}

module.exports = { loginUser };
