import React, { useState, useEffect } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ questions, topic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);

  useEffect(() => {
    // Function to check if the input is a non-empty string
    const isValidQuestionsString = (str) => {
      return typeof str === 'string' && str.trim().length > 0;
    };

    const parseQuestions = (questionsString) => {
      const pairs = questionsString.split('Question').slice(1);
      return pairs.map(pair => {
        const [question, answer] = pair.split('Answer');
        return {
          question: question.trim().replace(/^\d+\./, '').trim(),
          answer: answer.trim().replace(/^\d+\./, '').trim()
        };
      });
    };

    // Check if questions is a valid string before parsing
    if (isValidQuestionsString(questions)) {
      setParsedQuestions(parseQuestions(questions));
    } else {
      setParsedQuestions([]); // or handle invalid input appropriately
    }
  }, [questions]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextQuestion = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % parsedQuestions.length);
    setIsFlipped(false);
  };

  const prevQuestion = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? parsedQuestions.length - 1 : prevIndex - 1
    );
    setIsFlipped(false);
  };

  if (parsedQuestions.length === 0) {
    return <div>No valid questions available. Please provide valid input.</div>;
  }

  const currentQuestion = parsedQuestions[currentIndex];

  return (
    <div className="flashcard-container">
      <h2>Topic: {topic}</h2>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p>{currentQuestion.question}</p>
            <button onClick={flipCard}>Show Answer</button>
          </div>
          <div className="flashcard-back">
            <p>{currentQuestion.answer}</p>
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
