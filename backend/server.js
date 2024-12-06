const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const {systemIdentity, flashCardTask, quizTask} = require('./prompts.js');
const { testDatabaseConnection, loginUser, registerUser, validatePassword, updateAvatar, createContent, getUserContent, setLoginNow, getShopItems, getGold, updateGold, getXP, updatePassword, getStreak, updateStreak, updateXP, deleteContent } = require('./database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, sendWelcomeEmail } = require('./emailService');
const cron = require('node-cron');
require('dotenv').config();
const { pool } = require('./database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

//https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com/api/topic-questions
//origin:
//https://main.d1v5rs7h6klasx.amplifyapp.com
// SET ORIGIN TO TRUE FOR LOCAL TESTING

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors({
  origin: true,//'https://main.d3mw78ay7wmpwg.amplifyapp.com/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

app.get('/test', async (req, res) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        res.status(200).json({ message: 'API call successful!', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'API call failed!', error: error.message });
    }
});

app.get('/test-database', async (req, res) => {
    try {
        const response = await testDatabaseConnection();
        res.status(200).json({ message: 'Database connection successful!', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed!', error: error.message });
    }
});

// Function to generate content based on type (quiz or flashcard)
async function generateQuestions(content, Quiz, flashCard) {
    console.log("Entered generateQuestions");
    console.log("Topic picked is " + content);
    console.log("Quiz ", Quiz);
    console.log("flashCard ", flashCard);

    // Select the appropriate task based on isQuiz
    let selectedTask = "";
    
    if(Quiz){
        selectedTask = quizTask
    }

    if(flashCard){
        selectedTask = flashCardTask;
    }
   

    // Replace {TOPIC} in the task with the actual topic
    const userInquiry = selectedTask.replace('{TOPIC}', content);
    console.log("Task prompt: ", userInquiry);

    try {
        // Make the API call to OpenAI to generate the content
        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemIdentity,
                },
                {
                    role: "user",
                    content: userInquiry,
                }
            ],
            model: "gpt-3.5-turbo",
        });

        // Log the full chatCompletion response for debugging
        const chatResponse = chatCompletion.choices[0].message.content;

        console.log("Chat response content:", chatResponse);

        // Parse the response if it's JSON-like data
        let parsedResponse = null;
        try {
            parsedResponse = JSON.parse(chatResponse); // Try to parse the response if it's a JSON string
            console.log("Parsed response:", parsedResponse);
        } catch (err) {
            console.log("Response is not valid JSON, returning as plain text.");
            parsedResponse = chatResponse; // If it's not valid JSON, return it as plain text
        }

        // Return the response as a structured JSON object
        return {
            success: true,
            message: "Content generated successfully",
            data: parsedResponse || chatResponse,
            chatCompletion: chatCompletion, // Return the full chatCompletion for further inspection
        };

    } catch (error) {
        console.error("Error generating content:", error);
        return {
            success: false,
            error: error.message,
            chatCompletion: null, // No response if there was an error
        };
    }
}

// Route for topic-based questions
app.post('/api/topic-questions', async (req, res) => {
    try {
        const topic = req.body.topic;
        console.log("reg body", req.body.topic);
        //console.log("topicQuestionPrompt: ", topicQuestionPrompt); 
        const response = await generateQuestions(topic);
        //console.log('topicQuestionPrompt:', topicQuestionPrompt);
        res.json({ response: response });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Route for file-based questions
app.post('/api/file-questions', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        const response = await generateQuestions(fileContent);
        
        // Delete the file after processing
        fs.unlinkSync(req.file.path);

        res.json({ response: response });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const result = await registerUser(username, email, password);
    if (result.success) {
        sendWelcomeEmail(username, email);
        res.status(201).json({ userId: result.userId });
    } else {
        res.status(400).json({ error: result.error });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    if (result.success) {
        try{
            await setLoginNow(result.userId);
        }
        catch(error){
            console.error('Error updating last login:', error);
        }
        res.status(200).json({ userId: result.userId, avatar: result.avatar, token:password });
    } else {
        res.status(401).json({ error: result.error });
    }
});

app.post('/update-avatar', async (req, res) => {
    const { userId, avatar, token } = req.body;
    try {
        const validation = await validatePassword(userId, token);
        if (!validation.success) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const updateResult = await updateAvatar(userId, avatar);
        if (!updateResult.success) {
            return res.status(500).json({ error: updateResult.error });
        }

        res.status(200).json({ success: true, message: 'Avatar updated successfully' });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

app.post('/user-content', async (req, res) => {
    const { userId, token } = req.body;
    try {
        // Validate the user's password
        const validationResponse = await validatePassword(userId, token);
        if (!validationResponse.success) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Fetch the user's content
        const contentResponse = await getUserContent(userId);
        if (contentResponse.success) {
            res.status(200).json({ content: contentResponse.content });
        } else {
            res.status(500).json({ error: contentResponse.error });
        }
    } catch (error) {
        console.error('Error fetching user content:', error);
        res.status(500).json({ error: 'An error occurred while fetching user content' });
    }
});

app.get('/user/:userId/gold', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await getGold(userId);
        if (result.success) {
            res.json({ success: true, gold: result.gold });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching gold:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/user/:userName/xp', async (req, res) => {
    const { userName } = req.params;
    try {
        const result = await getXP(userName);
        if (result.success) {
            res.json({ success: true, xp: result.xp });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching xp:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/set/:userId/xp', async (req, res) => {
    const { userId, xp } = req.body;
    console.log("Adding XP Points", userId, xp);
    try {
        const result = await updateXP(userId, xp);
        if (result.success) {
            res.json({ success: true, message: 'XP updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
        
    } catch (error) {
        console.error('Error updating xp:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/set/:userId/streak', async (req, res) => {
    const { userId, streak } = req.body;
    try {
        const result = await updateStreak(userId, streak);
        if (result.success) {
            res.json({ success: true, message: 'Streak updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/user/:userName/streak', async (req, res) => {
    const { userName } = req.params;
    try {
        const result = await getStreak(userName);
        if (result.success) {
            res.json({ success: true, streak: result.streak });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/update-gold', async (req, res) => {
    const { userId, goldEarned } = req.body;
    if (!userId || typeof goldEarned !== 'number') {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    try {
        const result = await updateGold(userId, goldEarned);

        if (result.success) {
            res.json({ success: true, gold: result.gold });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error updating gold:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/create-content', async (req, res) => {
    const { userId, title, text, makeQuiz, makeCards, token } = req.body;
    console.log("enetered create content");


    try {
        // Validate the user's password
        const validationResponse = await validatePassword(userId, token);
        if (!validationResponse.success) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const text_id = uuidv4();

        // Create quiz content if requested
        if (makeQuiz) {
            const quizData = await generateQuestions(text, makeQuiz, makeCards); 
            const quizResponse = await createContent(userId, title, text_id, true, quizData);
            if (!quizResponse.success) {
                return res.status(500).json({ error: quizResponse.error });
            }
        }

        // Create flashcard content if requested
        if (makeCards) {
            console.log("enetered flashcards");
            const flashcardData = await generateQuestions(text, makeQuiz, makeCards);
            const flashcardResponse = await createContent(userId, title, text_id, false, flashcardData);
            if (!flashcardResponse.success) {
                return res.status(500).json({ error: flashcardResponse.error });
            }
        }

        res.status(201).json({ message: 'Content created successfully', text_id });
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ error: 'An error occurred while creating content' });
    }
});

app.post('/api/purchase', async (req, res) => {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ error: 'Missing userId or itemId' });
    }

    try {
        const userResult = await pool.query('SELECT gold FROM users WHERE user_id = $1', [userId]);
        const itemResult = await pool.query('SELECT cost FROM shop_items WHERE id = $1', [itemId]);
        const itemTitleResult = await pool.query('SELECT title FROM shop_items WHERE id = $1', [itemId]);
        const ownershipResult = await pool.query(
            'SELECT item_id FROM user_items WHERE user_id = $1 AND item_id = $2',
            [userId, itemId]
        );

        if (userResult.rows.length === 0 || itemResult.rows.length === 0) {
            return res.status(404).json({ error: 'User or item not found' });
        }

        if (ownershipResult.rows.length > 0) {
            return res.status(400).json({ error: 'Item already owned' });
        }

        const userGold = userResult.rows[0].gold;
        const itemCost = itemResult.rows[0].cost;
        const itemTitle = itemTitleResult.rows[0].title;

        if (userGold < itemCost) {
            return res.status(400).json({ error: 'Not enough gold' });
        }

        await pool.query('UPDATE users SET gold = gold - $1 WHERE user_id = $2', [itemCost, userId]);
        await pool.query('INSERT INTO user_items (user_id, item_id) VALUES ($1, $2)', [userId, itemId]);

        res.json({ success: true, message: `Item ${itemId} purchased successfully!`, title: itemTitle});
    } catch (error) {
        console.error('Error purchasing item:', error);
        res.status(500).json({ error: 'Failed to purchase item' });
    }
});

async function sendComeBackEmails() {
    try {
        const result = await pool.query('SELECT * FROM users WHERE last_login < NOW() - INTERVAL \'7 days\'');
        const users = result.rows;

        for (const user of users) {
            //TODO TODO WRITE EMAIL GENERATOR
            const emailContent = await generateEmailContent(user.user_id); 
            await sendEmail(user.email, 'We miss you!', emailContent);
        }
    } catch (error) {
        console.error('Error sending come back emails:', error);
    }
}

app.get('/api/shop-items', async (req, res) => {
    try {
        const result = await getShopItems(); // Fetch shop items from the database
        if (result.success) {
            res.json(result.items); // Send the items to the frontend
        } else {
            res.status(500).json({ error: result.error }); // Handle errors
        }
    } catch (error) {
        console.error('Error fetching shop items:', error);
        res.status(500).json({ error: 'An error occurred while fetching shop items' });
    }
});

app.get('/user/:id/items', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await pool.query(
            `
            SELECT ui.user_id,
                si.id AS item_id,
                si.title,
                si.image,
                si.special_ability
            FROM user_items ui
            JOIN shop_items si 
            ON si.id = ui.item_id
            WHERE ui.user_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No items found for this user' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user items:', error);

        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/user/:id/add-item', async (req, res) => {
    const { id } = req.params;
    const { itemId } = req.body;

    try {
        await pool.query(
            'INSERT INTO user_items (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, itemId]
        );
        res.json({ success: true, message: `Item ${itemId} added to user ${id}` });
    } catch (error) {
        console.error('Error adding item to user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/update-items/:userId', async (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ success: false, message: 'Item ID is required' });
    }

    try {
        const userItemCheck = await pool.query(
            `SELECT ui.user_id, si.title
             FROM user_items ui
             JOIN shop_items si ON si.id = ui.item_id
             WHERE ui.user_id = $1 AND si.id = $2`,
            [userId, itemId]
        );

        if (userItemCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found for this user' });
        }

        await pool.query(
            'DELETE FROM user_items WHERE user_id = $1 AND item_id = $2',
            [userId, itemId]
        );

        // perform actions based on the item's special ability
        // (for now, simply log it.)
        const itemDetails = userItemCheck.rows[0];
        console.log(`User ${userId} used item: ${itemDetails.title}`);

        const updatedItems = await pool.query(
            `
            SELECT si.id AS item_id, si.title, si.special_ability
            FROM user_items ui
            JOIN shop_items si ON si.id = ui.item_id
            WHERE ui.user_id = $1
            `,
            [userId]
        );

        res.json({
            success: true,
            message: 'Item used and removed successfully',
            updatedItems: updatedItems.rows,
        });
    } catch (error) {
        console.error('Error updating items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Validate the current password
        const validationResponse = await validatePassword(userId, currentPassword);
        if (!validationResponse.success) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the password
        const updateResponse = await updatePassword(userId, newPassword);
        if (updateResponse.success) {
            res.status(200).json({ success: true, message: 'Password changed successfully' });
        } else {
            res.status(500).json({ success: false, message: updateResponse.message });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/delete-content', async (req, res) => {
    const { userId, password, contentId } = req.body;

    try {
        // Validate the user's password
        const validationResponse = await validatePassword(userId, password);
        if (!validationResponse.success) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Delete the content
        const deleteResponse = await deleteContent(userId, contentId);
        if (deleteResponse.success) {
            res.status(200).json({ success: true, message: 'Content deleted successfully' });
        } else {
            res.status(400).json({ success: false, message: deleteResponse.message });
        }
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/validate-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        // Check if the email exists in the database
        const result = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            console.log(`Email not found: ${email}`);
            return res.status(404).json({ success: false, message: 'Email not associated with any account' });
        }

        const userId = result.rows[0].user_id;

        // Generate a random 6-digit code
        const code = crypto.randomInt(100000, 999999).toString();

        await pool.query(
            'INSERT INTO password_reset_codes (user_id, email, code, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'15 minutes\') ON CONFLICT (email) DO UPDATE SET code = $3, expires_at = NOW() + INTERVAL \'15 minutes\'',
            [userId, email, code]
        );

        const emailSent = await sendEmail(
            email,
            'Your Password Reset Code',
            `<p>Your password reset code is: <strong>${code}</strong></p><p>This code will expire in 15 minutes.</p>`
        );

        if (!emailSent.success) {
            console.error('Error sending email:', emailSent.error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }

        console.log(`Reset code sent to ${email}`);
        res.status(200).json({ success: true, message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Error processing password reset request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM password_reset_codes WHERE email = $1 AND code = $2 AND expires_at > NOW()',
            [email, code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        console.log(`Code verified for ${email}`);
        res.status(200).json({ success: true, message: 'Code verified' });
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/reset-password', async (req, res) => {
    
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING user_id',
            [hashedPassword, email]
        );

        if (result.rowCount === 0) {
            console.error(`Password reset failed. No user found for email: ${email}`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        console.log(`Password updated successfully for email: ${email}`);
        res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
});


cron.schedule('0 0 * * *', () => {
    sendComeBackEmails();
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
