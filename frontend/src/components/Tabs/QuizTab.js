import React, { useState } from 'react';
import '../../styles/Popup.css';
import '../../styles/QuizTab.css'; // Import the new CSS file for QuizTab

function QuizTab() {
    const [quizzes, setQuizzes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAddQuiz = (quiz) => {
        setQuizzes([...quizzes, quiz]);
        setIsPopupOpen(false);
    };

    return (
        <div className="quiz-tab-background">
            <div className="quiz-tab-sheet">
                <button className="full-width-button" onClick={() => setIsPopupOpen(true)}>Add Content</button>
                {isPopupOpen && <QuizPopup onAddQuiz={handleAddQuiz} onClose={() => setIsPopupOpen(false)} />}
                <h2>My Quizzes</h2>
                <ul className="quiz-list">
                    {quizzes.map((quiz, index) => (
                        <li key={index} className="quiz-list-item">{quiz.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function QuizPopup({ onAddQuiz, onClose }) {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizContent, setQuizContent] = useState('');
    const [isFileUpload, setIsFileUpload] = useState(false);

    const handleSubmit = () => {
        onAddQuiz({ title: quizTitle, content: quizContent });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setQuizContent(event.target.result);
        };
        reader.readAsText(file);
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Add a New Quiz</h3>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                />
                <div className="toggle-buttons">
                    <button
                        className={!isFileUpload ? 'active' : ''}
                        onClick={() => setIsFileUpload(false)}
                    >
                        Paste Text
                    </button>
                    <button
                        className={isFileUpload ? 'active' : ''}
                        onClick={() => setIsFileUpload(true)}
                    >
                        Upload File
                    </button>
                </div>
                {isFileUpload ? (
                    <input type="file" onChange={handleFileChange} />
                ) : (
                    <textarea
                        placeholder="Paste text here"
                        value={quizContent}
                        onChange={(e) => setQuizContent(e.target.value)}
                    ></textarea>
                )}
                <button className="submit-button" onClick={handleSubmit}>Add Quiz</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default QuizTab;