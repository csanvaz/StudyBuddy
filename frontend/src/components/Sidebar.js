import React from 'react';

function Sidebar({ setSelectedTab, selectedTab }) {
    return (
        <div className="sidebar">
            <button
                className={selectedTab === 'Tab1' ? 'active' : ''}
                onClick={() => setSelectedTab('Tab1')}
            >
                <span className="icon-placeholder">
                    <img src="/icons/homeIcon.png" alt="Tab 1 Icon" />
                </span>
                Home
            </button>
            <button
                className={selectedTab === 'StudyTab' ? 'active' : ''}
                onClick={() => setSelectedTab('StudyTab')}
            >
                <span className="icon-placeholder">
                    <img src="/icons/bookIcon.png" alt="Tab 2 Icon" />
                </span>
                Study
            </button>
            <button
                className={selectedTab === 'QuizTab' ? 'active' : ''}
                onClick={() => setSelectedTab('QuizTab')}
            >
                <span className="icon-placeholder">
                    <img src="/icons/quizIcon.png" alt="Tab 3 Icon" />
                </span>
                Quiz
            </button>
        </div>
    );
}

export default Sidebar;