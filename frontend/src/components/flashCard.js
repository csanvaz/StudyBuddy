import React, { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ questions = [], topic = 'Unknown Topic' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextQuestion = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setIsFlipped(false);
  };

  const prevQuestion = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? questions.length - 1 : prevIndex - 1
    );
    setIsFlipped(false);
  };

  // Safeguard against empty or undefined questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flashcard-container">
      <h2>Topic: {topic}</h2>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p>{currentQuestion?.question || 'Question not available'}</p>
            <button onClick={flipCard}>Show Answer</button>
          </div>
          <div className="flashcard-back">
            <p>{currentQuestion?.answer || 'Answer not available'}</p>
            <button onClick={flipCard}>Show Question</button>
          </div>
        </div>
      </div>
      <div className="navigation">
        <button onClick={prevQuestion}>Previous</button>
        <button onClick={nextQuestion}>Next</button>
      </div>
    </div>
  );
};

export default Flashcard;
