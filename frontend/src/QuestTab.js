import React, { useState } from 'react';
import './styles/Popup.css';
import './styles/QuestTab.css';


function QuestTab() {
    const [quests, setQuests] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAddQuest = (quest) => {
        setQuests([...quests, quest]);
        setIsPopupOpen(false);
    };

    return (
        <div className="quest-tab-background">
            <div className="quest-tab-sheet">
                <button className="full-width-button" onClick={() => setIsPopupOpen(true)}>Add Content</button>
                {isPopupOpen && <QuestPopup onAddQuest={handleAddQuest} onClose={() => setIsPopupOpen(false)} />}
                <h2>My Quests</h2>
                <ul className="quest-list">
                    {quests.map((quest, index) => (
                        <li key={index} className="quest-list-item">{quest.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function QuestPopup({ onAddQuest, onClose }) {
    const [questTitle, setQuestTitle] = useState('');
    const [questContent, setQuestContent] = useState('');
    const [isFileUpload, setIsFileUpload] = useState(false);

    const handleSubmit = () => {
        onAddQuest({ title: questTitle, content: questContent });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setQuestContent(event.target.result);
        };
        reader.readAsText(file);
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Add a New Quest</h3>
                <input
                    type="text"
                    placeholder="Quest Title"
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
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
                        value={questContent}
                        onChange={(e) => setQuestContent(e.target.value)}
                    ></textarea>
                )}
                <button className="submit-button" onClick={handleSubmit}>Add Quest</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default QuestTab;