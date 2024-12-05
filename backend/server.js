const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const {systemIdentity, flashCardTask, quizTask} = require('./prompts.js');
const { testDatabaseConnection, loginUser, registerUser, validatePassword, updateAvatar, createContent, getUserContent, setLoginNow } = require('./database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, sendWelcomeEmail } = require('./emailService');
const cron = require('node-cron');
require('dotenv').config();
const { pool } = require('./database');
const { getShopItems, getGold, updateGold } = require('./database');

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
async function generateQuestions(content, isQuiz) {
    console.log("Entered generateQuestions");
    console.log("Topic picked is " + content);
    console.log("Is quiz: " + isQuiz);

    // Select the appropriate task based on isQuiz
    const selectedTask = isQuiz ? quizTask : flashCardTask;

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

app.get('/user/:userName/gold', async (req, res) => {
    const { userName } = req.params;
    try {
        const result = await getGold(userName);
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

app.post('/update-gold', async (req, res) => {
    const { username, goldEarned } = req.body;
    console.log("Request body:", req.body);
    try {
        const result = await updateGold(username, goldEarned);
        console.log("Result:", result);
        if (result.success) {
            res.json({ success: true, gold: result.gold });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
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
            const quizData = await generateQuestions(text, makeQuiz); 
            const quizResponse = await createContent(userId, title, text_id, true, quizData);
            if (!quizResponse.success) {
                return res.status(500).json({ error: quizResponse.error });
            }
        }

        // Create flashcard content if requested
        if (makeCards) {
            console.log("enetered flashcards");
            const flashcardData = await generateQuestions(text, makeCards);
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

/*
app.get('/api/purchase', async (req, res) => {
    const { userId, itemId, token, gold } = req.body;
)
*/

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


cron.schedule('0 0 * * *', () => {
    sendComeBackEmails();
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
