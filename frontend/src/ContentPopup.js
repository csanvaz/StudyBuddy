import React, { useState } from 'react';
import './styles/Popup.css';

function ContentPopup({ onAddContent, onClose }) {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [contentTypes, setContentTypes] = useState({
        mcq: false,
        shortAnswer: false,
        flashcards: false
    });

    const handleSubmit = () => {
        onAddContent({ subject, content, contentTypes });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setContent(event.target.result);
        };
        reader.readAsText(file);
    };

    const handleCheckboxChange = (type) => {
        setContentTypes({ ...contentTypes, [type]: !contentTypes[type] });
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
                <div className="content-type-section">
                    <h4>Select Content Type</h4>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={contentTypes.mcq}
                                onChange={() => handleCheckboxChange('mcq')}
                            />
                            <span>Multiple Choice Quiz</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={contentTypes.shortAnswer}
                                onChange={() => handleCheckboxChange('shortAnswer')}
                            />
                            <span>Short Answer Quiz</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={contentTypes.flashcards}
                                onChange={() => handleCheckboxChange('flashcards')}
                            />
                            <span>Flashcards</span>
                        </label>
                    </div>
                </div>
                <button className="submit-button" onClick={handleSubmit}>Add Content</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ContentPopup;