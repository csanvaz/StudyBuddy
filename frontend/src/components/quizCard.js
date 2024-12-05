import React, { useState } from 'react';
import '../styles/QuizCard.css';

function QuizCard({ questionData }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
    const [isCorrect, setIsCorrect] = useState(null); // Track correctness of the answer
    const [score, setScore] = useState(0); // Track score
    const [attempted, setAttempted] = useState(false); // Track if the question was already attempted
    const [firstAttempt, setFirstAttempt] = useState(true); // Track if it's the first attempt

    const currentQuestion = questionData[currentQuestionIndex]; // Get current question
    const totalQuestions = 10; // Total questions per quiz
    const totalPoints = totalQuestions * 10; // Total points that can be earned

    // Handle checkbox selection
    const handleChoiceChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // Handle form submission and check the answer
    const handleSubmit = () => {
        if (attempted) return; // Prevent re-submission once an answer is already selected

        setAttempted(true); // Mark the question as attempted

        if (selectedAnswer === currentQuestion.correct_answer) {
            setIsCorrect(true); // Correct answer
            setScore(prevScore => prevScore + 10); // Award 10 points for correct answer
            if (firstAttempt) {
                setFirstAttempt(false); // No longer the first attempt after correct answer
            }
        } else {
            setIsCorrect(false); // Incorrect answer
        }
    };

    // Move to the next question
    const handleNextQuestion = () => {
        // Reset all necessary states for the next question
        setIsCorrect(null); // Reset correctness
        setSelectedAnswer(null); // Reset selected answer
        setAttempted(false); // Reset the attempted flag
        setFirstAttempt(true); // Reset first attempt flag for the new question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to next question
    };

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
                        firstAttempt ? (
                            <p style={{ color: 'green' }}>Congrats! You got it right on your first try! You earned 10 points!</p>
                        ) : (
                            <p style={{ color: 'green' }}>Congrats! You got it right!</p>
                        )
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
