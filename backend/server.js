const express = require('express');
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
import { topicQuestionPrompt } from './prompts.js';
require('dotenv').config();

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Function to generate questions
async function generateQuestions(content, isFile = false) {
    const systemPrompt = isFile 
        ? topicQuestionPrompt.replace('{TOPIC}', 'the content of the uploaded file')
        : topicQuestionPrompt.replace('{TOPIC}', content);

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
        const response = await generateQuestions(topic);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});