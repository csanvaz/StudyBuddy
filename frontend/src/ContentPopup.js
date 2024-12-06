import React, { useState } from 'react';
import './styles/Popup.css';

function ContentPopup({ onAddContent, onClose }) {
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [generateFlashcards, setGenerateFlashcards] = useState(false);
    const [generateQuiz, setGenerateQuiz] = useState(false);

    const handleSubmit = () => {
        onAddContent({ subject, text, generateFlashcards, generateQuiz });
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Add New Content</h3>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="input-field"
                    />
                    <textarea
                        placeholder="Paste text here"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="textarea-field"
                    ></textarea>
                </div>
                <div className="checkbox-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={generateFlashcards}
                            onChange={(e) => setGenerateFlashcards(e.target.checked)}
                            disabled={generateQuiz} // Disable flashcards checkbox if quiz is selected
                        />
                        Generate Flashcards
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={generateQuiz}
                            onChange={(e) => setGenerateQuiz(e.target.checked)}
                            disabled={generateFlashcards} // Disable quiz checkbox if flashcards is selected
                        />
                        Generate Quiz
                    </label>
                </div>
                <div className="button-container">
                    <button className="submit-button" onClick={handleSubmit}>Add Content</button>
                    <button className="close-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ContentPopup;
