import React, { useState } from 'react';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';
import Flashcard from './components/flashCard';

function StudyTab() {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [questionResponse, setQuestionResponse] = useState('');
    const [currentTopic, setCurrentTopic] = useState('');

    const handleAddContent = (material) => {
        setStudyMaterials([...studyMaterials, material]);
        setIsPopupOpen(false);
        fetchTopicQuestions(material.subject);
    };

    const fetchTopicQuestions = async (topic) => {
        try {
            const response = await fetch('http://localhost:5001/api/topic-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();
            setQuestionResponse(data.response);
            setCurrentTopic(topic);
            console.log('Generated Questions:', data.response);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
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
                            onClick={() => fetchTopicQuestions(material.subject)}
                        >
                            {material.subject}
                        </button>
                    ))}
                </div>
                {questionResponse && (
                    <div className="flashcard-section">
                        <h3>Flashcards for {currentTopic}</h3>
                        <Flashcard questions={questionResponse} topic={currentTopic} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyTab;