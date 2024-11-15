const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
//import { topicQuestionPrompt } from './prompts.js';
const topicQuestionPrompt = `<identity>You are an expert question generator, capable of creating diverse and engaging questions on any topic.</identity>

<task>Generate 5 unique and thought-provoking questions about {TOPIC}. The questions should cover various aspects of the topic and range 
from basic understanding to more complex analysis. Include multiple choice with the answer in a JSON reponse (how to keep track of question number?):
{
{
"question": ""
"A"
"B"
"C"
"D"
"Answer"
}
}

i would want it in one api call too, i'm using your api</task>`;
//const { topicQuestionPrompt } = require('./prompts.js');
require('dotenv').config();
//const { loginUser } = require('./loginUser');

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Function to generate questions
async function generateQuestions(content, isFile = false) {
    //console.log("enetered generateQuestions");
    const systemPrompt = topicQuestionPrompt.replace('{TOPIC}', content);
    //console.log("question prompt: ", topicQuestionPrompt);
    const chatCompletion = await client.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": systemPrompt,
            },
            {
                "role": "user",
                "content": isFile ? content : `Generate questions about ${content}`,
            }
        ],
        model: "gpt-3.5-turbo",
    });

    return chatCompletion.choices[0].message.content;
}

// Route for topic-based questions
app.post('/api/topic-questions', async (req, res) => {
    try {
        const topic = req.body.topic;
        //console.log("reg body", req.body.topic);
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
        const response = await generateQuestions(fileContent, true);
        
        // Delete the file after processing
        fs.unlinkSync(req.file.path);

        res.json({ response: response });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});
/*
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const result = await registerUser(username, email, password);
    if (result.success) {
      res.status(201).json({ userId: result.userId });
    } else {
      res.status(400).json({ error: result.error });
    }
  });
  
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    if (result.success) {
        const userResult = await pool.query('SELECT avatar FROM users WHERE username = $1', [username]);
        const avatar = userResult.rows[0]?.avatar || 'default';
        
        res.status(200).json({ userId: result.userId, avatar: avatar });
    } else {
        res.status(401).json({ error: result.error });
    }
});

app.post('/api/update-avatar', async (req, res) => {
    const { userId, avatar } = req.body;
    try {
        await pool.query('UPDATE users SET avatar = $1 WHERE user_id = $2', [avatar, userId]);
        res.status(200).json({ success: true, message: 'Avatar updated successfully' });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

*/

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});