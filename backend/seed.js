const pool = require('./database');
const bcrypt = require('bcrypt');

async function createTable() {
    try {
        // Create the `users` table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                quizzes JSONB DEFAULT '[]',
                avatar VARCHAR(255)
            );
        `);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
}

async function seedUsers() {
    try {
        // Insert initial users
        const users = [
            {
                username: 'test_user',
                email: 'john@example.com',
                password: 'password123',
                avatar: 'default'
            },
            {
                username: 'admin',
                email: 'jane@example.com',
                password: 'pass1234',
                avatar: 'default'
            }
        ];

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            await pool.query(
                `
                INSERT INTO users (username, email, password, quizzes, avatar)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (username) DO NOTHING;
                `,
                [user.username, user.email, hashedPassword, '[]', user.avatar]
            );
            console.log(`User ${user.username} inserted successfully`);
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await pool.end();
        console.log('Database connection closed');
    }
}

// Run the seed script
(async () => {
    await createTable();
    await seedUsers();
})();
