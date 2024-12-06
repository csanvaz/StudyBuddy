import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';
import Flashcard from './components/flashCard';
import QuizCard from './components/quizCard'
import backendURL from './config';

function StudyTab({ userId, token }) {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [currentContent, setCurrentContent] = useState(null);
    const [deletedMaterials, setDeletedMaterials] = useState(new Set());  // Track deleted materials

    const fetchUserContent = useCallback(async () => {
        try {
            const response = await axios.post(`${backendURL}/user-content`, {
                userId,
                token
            });
            setStudyMaterials(response.data.content);
            console.log("fetchUser Content returned", response.data.content.data.data.questions)
        } catch (error) {
            console.error('Error fetching user content:', error.response ? error.response.data : error.message);
        }
    },[userId, token]);

    useEffect(() => {
        fetchUserContent();
    }, [fetchUserContent]);

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
            console.error('Error adding content:', error.response ? error.response.data : error.message);
        }
        setIsPopupOpen(false);
    };

    const handleSelectContent = (content) => {
        setCurrentContent(content);
        setCurrentTopic(content.title);
    };

    const handleDeleteContent = async (contentId) => {
        try {
            const response = await axios.post(`${backendURL}/delete-content`, {
                userId,
                password: token, // Assuming token is used as password for validation
                contentId
            });
    
            if (response.data.success) {
                // Refetch the content after successful deletion
                fetchUserContent();
            } else {
                alert('Failed to delete content: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting content:', error.response ? error.response.data : error.message);
            alert('An error occurred while deleting content. Please try again.');
        }
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
                            {groupedMaterials[textId].map((material) => (
                                <div key={material.content_id} className="material-item">
                                    <button
                                        className="material-button"
                                        onClick={() => handleSelectContent(material)}
                                    >
                                        {material.title} ({material.is_quiz ? 'Quiz' : 'Flashcards'})
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteContent(material.content_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {currentContent && !deletedMaterials.has(currentContent.content_id) && (
                    <div className="flashcard-section">
                        {currentContent.is_quiz ? (
                            <QuizCard questionData={currentContent.data.data.questions} /> // Pass the full array of questions
                        ) : (
                            <Flashcard questions={currentContent.data.data.questions} topic={currentTopic} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyTab;
