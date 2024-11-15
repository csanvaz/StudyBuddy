import React, { useState } from 'react';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';

function StudyTab() {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [questionResponse, setQuestionResponse] = useState('');

    const handleAddContent = (material) => {
        setStudyMaterials([...studyMaterials, material]);
        setIsPopupOpen(false);
        fetchTopicQuestions(material.subject); // Fetch questions when content is added
    };

    // Function to make POST request to the backend
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
                {/* Display the response below */}
                {questionResponse && (
                    <div className="response-section">
                        <h3>Generated Questions:</h3>
                        <p>{questionResponse}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyTab;