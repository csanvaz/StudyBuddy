import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';
import Flashcard from './components/flashCard';

const backendURL = 'http://localhost:8080';
//const backendURL = "https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com"

function StudyTab({ userId, token }) {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [currentContent, setCurrentContent] = useState(null);

    const fetchUserContent = async () => {
        try {
            const response = await axios.post(`${backendURL}/user-content`, {
                userId,
                token
            });
            setStudyMaterials(response.data.content);
        } catch (error) {
            console.error('Error fetching user content:', error);
        }
    };

    useEffect(() => {
        fetchUserContent();
    }, [userId, token]);

    const handleAddContent = async (material) => {
        try {
            await axios.post(`${backendURL}/create-content`, {
                userId,
                title: material.subject,
                text: material.text,
                makeQuiz: material.generateQuiz,
                makeCards: material.generateFlashcards,
                token: token
            });

            fetchUserContent();
        } catch (error) {
            console.error('Error adding content:', error);
        }
        setIsPopupOpen(false);
    };

    const handleSelectContent = (content) => {
        setCurrentContent(content);
        setCurrentTopic(content.title);
    };

    const groupedMaterials = studyMaterials.reduce((acc, material) => {
        if (!acc[material.text_id]) {
            acc[material.text_id] = [];
        }
        acc[material.text_id].push(material);
        return acc;
    }, {});

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
                    {Object.keys(groupedMaterials).map((textId) => (
                        <div key={textId} className="material-group">
                            <h3>{groupedMaterials[textId][0].title}</h3> {/* Title with the given title */}
                            {groupedMaterials[textId].map((material) => (
                                <div key={material.content_id} className="material-item">
                                    <button
                                        className="material-button"
                                        onClick={() => handleSelectContent(material)}
                                    >
                                        {material.title} ({material.is_quiz ? 'Quiz' : 'Flashcards'})
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {currentContent && (
                    <div className="flashcard-section">
                        <h3>{currentContent.title}</h3>
                        {currentContent.is_quiz ? (
                            <div>Quiz content goes here</div>
                        ) : (
                            <Flashcard questions={currentContent.data} topic={currentTopic} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyTab;