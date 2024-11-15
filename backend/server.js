const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const flashCardPrompt = require('./prompts.js');
const mulitpleChoiceQuestionPrompt = require('./prompts.js');
const askMyDocPrompt = require('./prompts.js');

require('dotenv').config();

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors({
  origin: 'https://main.d1v5rs7h6klasx.amplifyapp.com',
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

// Function to generate questions
async function generateQuestions(content, isFile = false, multipleChoice = false) {
    console.log("entered generateQuestions");
     
    let systemPrompt;
    if (isFile) {
        systemPrompt = askMyDocPrompt.replace('{TOPIC}', 'the content of the uploaded file');
    } else if (multipleChoice) {
        systemPrompt = mulitpleChoiceQuestionPrompt.replace('{TOPIC}', content);
    } else {
        systemPrompt = flashCardPrompt.replace('{TOPIC}', content);
    }
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
        //const multipleChoice = req.body.
        console.log("reg body", req.body.topic);
        // console.log("topicQuestionPrompt: ", flashCardPrompt); 
        const response = await generateQuestions(topic, multipleChoice);
        // console.log('topicQuestionPrompt:', flashCardPrompt);
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
