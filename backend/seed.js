const { pool } = require('./database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function dropTables() {
    try {
        await pool.query('DROP TABLE IF EXISTS content');
        await pool.query('DROP TABLE IF EXISTS users');
        console.log('Tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
    }
}

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                avatar VARCHAR(255),
                gold INTEGER DEFAULT 0,
                last_login TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Users table created successfully');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS content (
                user_id INTEGER REFERENCES users(user_id),
                title VARCHAR(255),
                content_id SERIAL PRIMARY KEY,
                text_id UUID NOT NULL,
                is_quiz BOOLEAN NOT NULL,
                data JSONB NOT NULL
            );
        `);
        console.log('Content table created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

async function seedUsers() {
    try {
        const users = [
            {
                username: 'john',
                email: 'john@example.com',
                password: await bcrypt.hash('123', 10),
                avatar: 'default_avatar.png'
            },
            {
                username: 'jane_doe',
                email: 'jane@example.com',
                password: await bcrypt.hash('password123', 10),
                avatar: 'default_avatar.png'
            }
        ];

        for (const user of users) {
            await pool.query(
                'INSERT INTO users (username, email, password, avatar, gold, last_login) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (username) DO NOTHING',
                [user.username, user.email, user.password, user.avatar, 0]
            );
        }

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}

async function seedContent() {
    try {
        const text_id = uuidv4();

        const content = [
            {
                user_id: 1,
                title: "Math Quiz",
                text_id: text_id,
                is_quiz: true,
                data: { question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" }
            },
            {
                user_id: 1,
                title: "Geography Question",
                text_id: text_id,
                is_quiz: false,
                data: { question: "What is the capital of France?", answer: "Paris" }
            }
        ];

        for (const item of content) {
            await pool.query(
                'INSERT INTO content (title, text_id, is_quiz, data) VALUES ($1, $2, $3, $4)',
                [item.title, item.text_id, item.is_quiz, item.data]
            );
        }

        console.log('Content seeded successfully');
    } catch (error) {
        console.error('Error seeding content:', error);
    }
}

async function seedDatabase() {
    await dropTables();
    await createTables();
    await seedUsers();
    await seedContent();
    pool.end();
}

seedDatabase();