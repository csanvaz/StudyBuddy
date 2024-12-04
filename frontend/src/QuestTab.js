import React, { useState } from 'react';
import './styles/QuestTab.css';

function QuestPage() {
    const [completedQuests, setCompletedQuests] = useState(0); // Tracks completed activities
    const [activeShopIndex, setActiveShopIndex] = useState(0);

    const shopItems = [
        { id: 1, icon: '/path/to/xp-icon.png', title: 'x3 XP', action: 'Wear' },
        { id: 2, icon: '/path/to/shield-icon.png', title: 'Streak Protection', cost: 500 },
        { id: 3, icon: '/path/to/another-item.png', title: 'Item 3', action: 'Buy' },
    ];

    const handleNextItem = () => {
        setActiveShopIndex((prevIndex) => (prevIndex + 1) % shopItems.length);
    };

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
                        {/* Snake-like Path */}
                        <path
                            d="M350 450 C300 400, 200 500, 150 300 C100 100, 50 300, 10 100"
                            stroke="#C0C0C0"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="5,5"
                        />
                        {Array.from({ length: 7 }).map((_, index) => {
                            const positions = [
                                { x: 350, y: 450 },
                                { x: 280, y: 400 },
                                { x: 200, y: 350 },
                                { x: 130, y: 300 },
                                { x: 80, y: 250 },
                                { x: 50, y: 180 },
                                { x: 30, y: 120 },
                            ];

                            const circleSize = 20 + (index % 2 === 0 ? 3 : -3); // Alternate sizes
                            const isCompleted = index < completedQuests;

                            return (
                                <g
                                    key={index}
                                    className={`progress-node ${isCompleted ? 'gold' : 'silver'}`}
                                    onClick={() => handleCompleteQuest(index)}
                                >
                                    <circle
                                        cx={positions[index].x}
                                        cy={positions[index].y}
                                        r={circleSize} // Dynamic radius
                                        fill={isCompleted ? 'gold' : '#C0C0C0'}
                                    />
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
                            top: '20px', // Adjust positioning
                            left: '40px', // Adjust positioning
                        }}
                    >
                        <img
                            src="/path/to/mystery-box-icon.png"
                            alt="Mystery Box"
                        />
                    </div>
                </div>
            </div>

            {/* Equipment and Avatar Section */}
            <div className="equipment-avatar-box">
                <h2 className="box-title">Available Equipment</h2>
                <div className="avatar-container">
                    <img src="/path/to/avatar-placeholder.png" alt="Avatar" />
                </div>
                <div className="shop-grid">
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
