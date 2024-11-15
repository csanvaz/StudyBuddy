import React, { useState } from 'react';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';
import Flashcard from './components/flashCard';

function StudyTab() {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [questionResponse, setQuestionResponse] = useState('');
    const [currentTopic, setCurrentTopic] = useState('');
    const [showOptionPopup, setShowOptionPopup] = useState(false);

    const handleAddContent = (material) => {
        setStudyMaterials([...studyMaterials, material]);
        setIsPopupOpen(false);
    };

    const fetchTopicQuestions = async (topic) => {
        try {
            const response = await fetch('https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com/api/topic-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            const data = await response.json();
            setQuestionResponse(data.response);
            setCurrentTopic(topic);
            console.log('Generated Questions:', data.response);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleTopicClick = (topic) => {
        setCurrentTopic(topic);
        setShowOptionPopup(true); 
    };

    const handleOptionSelection = (option) => {
        setShowOptionPopup(false); 

        if (option === 'Flashcards') {
            fetchTopicQuestions(currentTopic); // Continue to flashcards
        } else {
            alert(`${option} is coming soon!`); // Alert for other options
        }
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

                {showOptionPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h3>Select an Option for {currentTopic}</h3>
                            <button
                                className="menu-option"
                                onClick={() => handleOptionSelection('Flashcards')}
                            >
                                Flashcards
                            </button>
                            <button
                                className="menu-option"
                                onClick={() => handleOptionSelection('Multiple Choice')}
                            >
                                Multiple Choice
                            </button>
                            <button
                                className="menu-option"
                                onClick={() => handleOptionSelection('Short Answer')}
                            >
                                Short Answer
                            </button>
                            <button
                                className="menu-option"
                                onClick={() => setShowOptionPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

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
