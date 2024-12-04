import React, { useState } from 'react';
import './styles/Popup.css';
import './styles/QuestTab.css';


function QuestPage() {
    // State management
    const [completedQuests, setCompletedQuests] = useState(0); // Tracks completed activities
    const [activeShopIndex, setActiveShopIndex] = useState(0);

    // Shop items array
    const shopItems = [
        { id: 1, icon: '/path/to/xp-icon.png', title: 'x3 XP', action: 'Wear' },
        { id: 2, icon: '/path/to/shield-icon.png', title: 'Streak Protection', cost: 500 },
        { id: 3, icon: '/path/to/another-item.png', title: 'Item 3', action: 'Buy' },
    ];

    // Function to navigate through shop items
    const handleNextItem = () => {
        setActiveShopIndex((prevIndex) => (prevIndex + 1) % shopItems.length);
    };

    // Function to complete a quest
    const handleCompleteQuest = (index) => {
        if (index === completedQuests) {
            setCompletedQuests(completedQuests + 1); // Mark the current quest as completed
        }
    };

    return (
        <div className="quest-page">
            {/* Weekly Quest Section */}
            <div className="weekly-quest">
                <h2>Weekly Quest</h2>
                <div className="progress-container">
                    <svg
                        className="progress-path"
                        viewBox="0 0 400 500"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Dotted curved path */}
                        <path
                            d="M350 450 C300 300, 150 300, 50 100"
                            stroke="#C0C0C0"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="5,5"
                        />
                        {/* Position nodes along the path */}
                        {Array.from({ length: 7 }).map((_, index) => {
                            // Adjust positions along the path
                            const positions = [
                                { x: 350, y: 450 },
                                { x: 300, y: 380 },
                                { x: 230, y: 330 },
                                { x: 150, y: 250 },
                                { x: 100, y: 200 },
                                { x: 70, y: 150 },
                                { x: 50, y: 100 },
                            ];

                            const isCompleted = index < completedQuests;

                            return (
                                <g
                                    key={index}
                                    className={`progress-node ${
                                        isCompleted ? 'gold' : 'silver'
                                    }`}
                                    onClick={() => handleCompleteQuest(index)}
                                >
                                    {/* Circle */}
                                    <circle
                                        cx={positions[index].x}
                                        cy={positions[index].y}
                                        r="20"
                                        fill={isCompleted ? 'gold' : '#C0C0C0'}
                                    />
                                    {/* Text */}
                                    <text
                                        x={positions[index].x}
                                        y={positions[index].y + 5}
                                        textAnchor="middle"
                                        fontSize="14"
                                        fill="white"
                                    >
                                        {index + 1}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                    {/* Mystery Box */}
                    <div
                        className="mystery-box"
                        style={{
                            top: '80px',
                            left: '40px',
                        }}
                    >
                        <img
                            src="/path/to/mystery-box-icon.png"
                            alt="Mystery Box"
                        />
                    </div>
                </div>
            </div>

            {/* Shop and Avatar Section */}
            <div className="avatar-shop">
                <div className="avatar">
                    <img src="/path/to/avatar-placeholder.png" alt="Avatar" />
                </div>
                <h3>Available Equipment</h3>
                <div className="shop">
                    <div className="shop-item">
                        <img
                            src={shopItems[activeShopIndex].icon}
                            alt={shopItems[activeShopIndex].title}
                        />
                        <p>{shopItems[activeShopIndex].title}</p>
                        {shopItems[activeShopIndex].cost ? (
                            <button>Buy ({shopItems[activeShopIndex].cost})</button>
                        ) : (
                            <button>{shopItems[activeShopIndex].action}</button>
                        )}
                    </div>
                    <button className="next-button" onClick={handleNextItem}>
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestPage;
