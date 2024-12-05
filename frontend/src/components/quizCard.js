import React, { useState } from 'react';

function QuizCard({ questionData }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Store the selected answer
    const [isCorrect, setIsCorrect] = useState(null); // Store the correctness of the answer

    // Handle checkbox selection
    const handleChoiceChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // Handle form submission and check the answer
    const handleSubmit = () => {
        if (selectedAnswer === questionData.correctAnswer) {
            setIsCorrect(true); // Answer is correct
        } else {
            setIsCorrect(false); // Answer is incorrect
        }
    };

    return (
        <div className="multiple-choice-container">
            <h2>{questionData.question}</h2>
            <div className="choices">
                {questionData.choices.map((choice, index) => (
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
        </div>
    );
}

export default QuizCard;
