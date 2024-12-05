const { pool } = require('./database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function dropTables() {
    try {
        await pool.query('DROP TABLE IF EXISTS content');
        await pool.query('DROP TABLE IF EXISTS users');
        await pool.query('DROP TABLE IF EXISTS shop_items');
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

         // Shop Items Table
         await pool.query(`
            CREATE TABLE IF NOT EXISTS shop_items (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL, -- Display title
                title2 VARCHAR(255) NOT NULL, -- Hover message
                image VARCHAR(255) NOT NULL, -- Image path
                action VARCHAR(50),
                cost INT NOT NULL, -- Price of the item
                special_ability VARCHAR(255) -- Special perks/abilities
            );
        `);
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
                'INSERT INTO users (username, email, password, avatar, last_login) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (username) DO NOTHING',
                [user.username, user.email, user.password, user.avatar]
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

async function seedShopItems() {
    try {
        const shopItems = [
            {
                title: "2D Glasses",
                title2: "Double XP for 1 hour",
                image: "/assets/2dglasses.png",
                action: "Buy",
                cost: 100,
                special_ability: "Double XP for 1 hour"
            },
            {
                title: "Golden Shield",
                title2: "Protect your streak for 1 day",
                image: "/assets/goldshield.png",
                action: "Buy",
                cost: 100,
                special_ability: "Protect your streak for 1 day"
            },
            {
                title: "Diamond Shield",
                title2: "Protect your streak for 3 days",
                image: "/assets/diamond_shield.png",
                action: "Buy",
                cost: 200,
                special_ability: "Protect your streak for 3 day"
            },
            {
                title: "Slice of Pie",
                title2: "Complete your daily quiz in one bite",
                image: "/assets/sliceofpie.png",
                action: "Buy",
                cost: 150,
                special_ability: "Protect your streak for 3 day"
            },
            {
                title: "3D Glasses",
                title2: "Triple XP for 1 hour",
                image: "/assets/3dglasses.png",
                action: "Buy",
                cost: 200,
                special_ability: "Triple XP for 1 hour"
            },
            {
                title: "Bookmark",
                title2: "Complete your tomorrow's quiz today",
                image: "/assets/bookmark.png",
                action: "Buy",
                cost: 150,
                special_ability: "Complete your tomorrow's quiz today"
            },
            {
                title: "Time Machine",
                title2: "Missed a streak yesterday? Restore it today!",
                image: "/assets/timemachine.png",
                action: "Buy",
                cost: 150,
                special_ability: "Restore your missed streak"
            },
            {
                title: "Crazy Bookmark",
                title2: "Complete your next two days quizes today",
                image: "/assets/bookmark2.png",
                action: "Buy",
                cost: 150,
                special_ability: "Complete your next two days quizes today"
            }
        ];

        for (const item of shopItems) {
            await pool.query(
                'INSERT INTO shop_items (title, title2, image, action, cost, special_ability) VALUES ($1, $2, $3, $4, $5, $6)',
                [item.title, item.title2, item.image, item.action, item.cost, item.special_ability]
            );
        }

        console.log('Shop items seeded successfully');
    } catch (error) {
        console.error('Error seeding shop items:', error);
    }
}



async function seedDatabase() {
    await dropTables();
    await createTables();
    await seedUsers();
    await seedContent();
    await seedShopItems(); // shop items
    pool.end();
}

seedDatabase();
