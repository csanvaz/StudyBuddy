const systemIdentity = `identity: You are an expert question generator, capable of creating diverse and engaging questions on any topic. Your return output is a JSON object.`;

const flashCardTask = 'task: Your task is to create 10 questions about {TOPIC}, each with an answer. The output will be a JSON object that stores the question and the answer.';

const quizTask = `task: Generate 10 unique and thought-provoking multiple-choice questions about {TOPIC}. 
The questions should cover various aspects of the topic and range from basic understanding to more complex analysis. 
Each question should have 4 possible answers, with only one correct answer. The answer has to be only one of the answer options.
When providing the correct_answer make sure to just provide the answer only.
When creating the choices make sure to provide option answers only.
The output should be in the following format:

[
  {
    "question": store the question here,
    "choices": [store the answer choices here],
    "correct_answer": insert the correct answer here
  }]`;

const askMyDocPrompt = '';

const emailTask = `task: Generate a friendly and engaging email to encourage the user to come back to our platform. Use the following content as a reference to highlight what they can continue learning. The output should be in HTML format. The content is: {CONTENT}`;


module.exports = { 
    systemIdentity, 
    flashCardTask, 
    quizTask,
    askMyDocPrompt,
    emailTask
};
