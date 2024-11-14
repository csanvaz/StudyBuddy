import React, { useState } from 'react';
import './styles/Popup.css';
import './styles/QuizTab.css';


function StudyTab() {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAddContent = (material) => {
        setStudyMaterials([...studyMaterials, material]);
        setIsPopupOpen(false);
    };

    return (
        <div className="study-tab-background">
            <div className="study-tab-sheet">
                <button className="full-width-button" onClick={() => setIsPopupOpen(true)}>Add Content</button>
                {isPopupOpen && <ContentPopup onAddContent={handleAddContent} onClose={() => setIsPopupOpen(false)} />}
                <h2>Study Material</h2>
                <div className="study-materials">
                    {studyMaterials.map((material, index) => (
                        <button
                            key={index}
                            className="material-button"
                            onClick={() => alert(`Clicked: ${material.subject}`)}
                        >
                            {material.subject}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

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
                            Multiple Choice Quiz
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={contentTypes.shortAnswer}
                                onChange={() => handleCheckboxChange('shortAnswer')}
                            />
                            Short Answer Quiz
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={contentTypes.flashcards}
                                onChange={() => handleCheckboxChange('flashcards')}
                            />
                            Flashcards
                        </label>
                    </div>
                </div>
                <button className="submit-button" onClick={handleSubmit}>Add Content</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default StudyTab;
