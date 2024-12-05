import React, { useState } from 'react';
import '../styles/QuizCard.css';

function QuizCard({ questionData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
    const [isCorrect, setIsCorrect] = useState(null); // Track correctness of the answer

    const currentQuestion = questionData[currentQuestionIndex]; // Get current question

    // Handle checkbox selection
    const handleChoiceChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // Handle form submission and check the answer
    const handleSubmit = () => {
        if (selectedAnswer === currentQuestion.correct_answer) {
            setIsCorrect(true); // Correct answer
        } else {
            setIsCorrect(false); // Incorrect answer
        }
    };

    // Move to the next question
    const handleNextQuestion = () => {
        setIsCorrect(null); // Reset correctness
        setSelectedAnswer(null); // Reset selected answer
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to next question
    };

    return (
        <div className="quiz-card-container">
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
                        <p style={{ color: 'green' }}>Correct!</p>
                    ) : (
                        <p style={{ color: 'red' }}>Incorrect! Try again.</p>
                    )}
                </div>
            )}
            {isCorrect !== null && currentQuestionIndex < questionData.length - 1 && (
                <button onClick={handleNextQuestion}>Next Question</button>
            )}
        </div>
    );
}

export default QuizCard;
