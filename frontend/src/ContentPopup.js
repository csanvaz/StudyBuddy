import React, { useState } from 'react';

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
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <textarea
                    placeholder="Paste text here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={generateFlashcards}
                            onChange={(e) => setGenerateFlashcards(e.target.checked)}
                        />
                        Generate Flashcards
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={generateQuiz}
                            onChange={(e) => setGenerateQuiz(e.target.checked)}
                        />
                        Generate Quiz
                    </label>
                </div>
                <button className="submit-button" onClick={handleSubmit}>Add Content</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ContentPopup;