import React, { useState } from 'react';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';
import Flashcard from './components/flashCard';

const backendUrl = 'https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com/api/topic-questions';
const testUrl = 'http://localhost:8080/api/topic-questions';

function StudyTab() {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [questionResponse, setQuestionResponse] = useState('');
    const [currentTopic, setCurrentTopic] = useState('');

    const handleAddContent = async (material) => {
        setStudyMaterials([...studyMaterials, material]);
        setIsPopupOpen(false);

        if (material.generateFlashcards || material.generateQuiz) {
            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic: material.subject }),
                });

                const data = await response.json();
                setQuestionResponse(data.response);
                setCurrentTopic(material.subject);
                console.log('Generated Questions:', data.response);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
    };

    const handleTopicClick = (topic) => {
        setCurrentTopic(topic);
        // Fetch questions or handle topic click logic here if needed
    };

    return (
        <div className="study-tab-background">
            <div className="study-tab-sheet">
                <button
                    className="full-width-button"
                    onClick={() => setIsPopupOpen(true)}
                >
                    Add Content
                </button>
                {isPopupOpen && (
                    <ContentPopup
                        onAddContent={handleAddContent}
                        onClose={() => setIsPopupOpen(false)}
                    />
                )}
                <h2>Study Material</h2>
                <div className="study-materials">
                    {studyMaterials.map((material, index) => (
                        <button
                            key={index}
                            className="material-button"
                            onClick={() => handleTopicClick(material.subject)}
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