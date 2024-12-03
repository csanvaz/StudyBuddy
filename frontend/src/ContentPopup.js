import React, { useState } from 'react';
import './styles/Popup.css';

function ContentPopup({ onAddContent, onClose }) {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [generateFlashcards, setGenerateFlashcards] = useState(false);
    const [generateQuiz, setGenerateQuiz] = useState(false);

    const handleSubmit = () => {
        onAddContent({ subject, content, generateFlashcards, generateQuiz });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setContent(event.target.result);
        };
        reader.readAsText(file);
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                )}
                <div className="checkbox-group">
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