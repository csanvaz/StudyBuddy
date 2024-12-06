import React, { useState } from 'react';
import '../styles/QuizCard.css';
import backendURL from '../config';

function QuizCard({ questionData = [], userId }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
    const [isCorrect, setIsCorrect] = useState(null); // Track correctness of the answer
    const [score, setScore] = useState(0); // Track score

    const currentQuestion = questionData[currentQuestionIndex]; // Get current question
    const totalQuestions = questionData.length; // Total questions from the data
    const totalPoints = totalQuestions * 10; // Total points that can be earned

    // Handle checkbox selection
    const handleChoiceChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    const handleSubmit = () => {
        if (!currentQuestion) return; // Prevent further actions if question is undefined
    
        let updatedScore = score; // Start with the current score
        if (selectedAnswer === currentQuestion.correct_answer) {
            setIsCorrect(true); // Correct answer
            updatedScore += 10; // Add 10 points if the answer is correct
        } else {
            setIsCorrect(false); // Incorrect answer
        }
    
        setScore(updatedScore); // Update the state with the new score
        updateHomeXP(userId, updatedScore); // Send the updated score to the backend
    };
    

    // Send score update to the backend
    const updateHomeXP = async (userId, updatedScore) => {
        console.log("Updating Home XP", updatedScore, userId);

        try {
            const response = await fetch(`${backendURL}/set/:userId/xp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, xp: updatedScore }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error');
            } else {
                console.log('XP points sent successfully!');
            }
        } catch (error) {
            console.error('Failed to send XP Points', error);
        }
    };

    // Move to the next question
    const handleNextQuestion = () => {
        // Send the updated score to the backend
        updateHomeXP(userId, score);

        // Reset all necessary states for the next question
        setIsCorrect(null); // Reset correctness
        setSelectedAnswer(null); // Reset selected answer
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to next question
    };

    // If no question data is provided, show a fallback message
    if (!currentQuestion) {
        return (
            <div className="quiz-card-container">
                <p>No questions available. Please check the data source.</p>
            </div>
        );
    }

    return (
        <div className="quiz-card-container">
            <div className="score-header">
                <p style={{ color: '#40C4B3' }}>
                    {score} / {totalPoints} Points
                </p>
            </div>
            <h2>{currentQuestion.question}</h2>
            <div className="choices">
                {currentQuestion.choices.map((choice, index) => (
                    <div key={index} className="choice">
                        <input
                            type="radio"
                            id={`choice-${index}`}
                            name="choice"
                            value={choice}
                            checked={selectedAnswer === choice}
                            onChange={handleChoiceChange}
                        />
                        <label htmlFor={`choice-${index}`}>{choice}</label>
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit}>Submit</button>
            {isCorrect !== null && (
                <div className="result">
                    {isCorrect ? (
                        <p style={{ color: 'green' }}>Congrats! You got it right!</p>
                    ) : (
                        <p style={{ color: 'red' }}>Sorry, this is wrong! Try again.</p>
                    )}
                </div>
            )}
            {isCorrect !== null && currentQuestionIndex < totalQuestions - 1 && (
                <button onClick={handleNextQuestion}>Next Question</button>
            )}
        </div>
    );
}

export default QuizCard;
