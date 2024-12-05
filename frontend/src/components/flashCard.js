import React, { useState, useEffect } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ questions, topic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);

  useEffect(() => {
    const parseQuestions = (questionsData) => {
      if (typeof questionsData === 'string') {
        try {
          questionsData = JSON.parse(questionsData);
        } catch (error) {
          console.error("Failed to parse questions string:", error);
          return [];
        }
      }

      if (questionsData && questionsData.quiz_questions) {
        return questionsData.quiz_questions.map(q => ({
          question: q.question,
          answer: q.answer
        }));
      }

      return [];
    };

    setParsedQuestions(parseQuestions(questions));
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