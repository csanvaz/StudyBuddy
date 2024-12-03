const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const flashCardPrompt = require('./prompts.js');
const { testDatabaseConnection, loginUser, registerUser, validatePassword, updateAvatar } = require('./database');
const mulitpleChoiceQuestionPrompt = require('./prompts.js');
const askMyDocPrompt = require('./prompts.js');

const flashCardPrompt1 = JSON.stringify(flashCardPrompt)

require('dotenv').config();

//https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com/api/topic-questions
//origin:
//https://main.d1v5rs7h6klasx.amplifyapp.com
// SET ORIGIN TO TRUE FOR LOCAL TESTING

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors({
  origin: true,//'https://main.d1v5rs7h6klasx.amplifyapp.com',
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

// Function to generate questions
async function generateQuestions(content, isFile = false) {
    console.log("enetered generateQuestions");
    const systemPrompt = isFile 
        ? flashCardPrompt.replace('{TOPIC}', 'the content of the uploaded file')
        : String(flashCardPrompt1).replace('{TOPIC}', content);
    console.log("system prompt: ", systemPrompt);
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
      res.status(201).json({ userId: result.userId });
    } else {
      res.status(400).json({ error: result.error });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    if (result.success) {
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});