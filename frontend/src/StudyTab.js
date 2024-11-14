import React, { useState } from 'react';
import ContentPopup from './ContentPopup';
import './styles/StudyTab.css';

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
export default StudyTab;