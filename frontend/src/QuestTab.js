// QuestPage.jsx
import React, { useState, useEffect } from 'react';
import './styles/QuestTab.css';
import { GiGoldBar } from 'react-icons/gi'; // Import the gold bar icon

const backendURL = "http://localhost:8080";
// const backendURL = "https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com"

// Fixed import of images
const images = {
  '/assets/2dglasses.png': require('./assets/2dglasses.png'),
  '/assets/goldshield.png': require('./assets/goldshield.png'),
  '/assets/diamond_shield.png': require('./assets/diamond_shield.png'),
  '/assets/sliceofpie.png': require('./assets/sliceofpie.png'),
  '/assets/3dglasses.png': require('./assets/3dglasses.png'),
  '/assets/bookmark.png': require('./assets/bookmark.png'),
  '/assets/timemachine.png': require('./assets/timemachine.png'),
  '/assets/bookmark2.png': require('./assets/bookmark2.png'),
  '/assets/mystery-box-icon.png': require('./assets/mystery-box-icon.png'),
  '/assets/default.png': require('./assets/default.png'), // Fallback image
  // Add other images here...
};

function QuestPage() {
  const [completedQuests, setCompletedQuests] = useState(0); // Tracks completed activities
  const [shopItems, setShopItems] = useState([]); // Dynamic shop items

  // Fetch shop items from the backend
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await fetch(`${backendURL}/api/shop-items`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched shop items:', data); // Debugging log
        setShopItems(data); // Update state with fetched shop items
      } catch (error) {
        console.error('Error fetching shop items:', error);
      }
    };

    fetchShopItems();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleCompleteQuest = (index) => {
    if (index === completedQuests) {
      setCompletedQuests(completedQuests + 1); // Mark the current quest as completed
    }
  };

  const handlePurchase = async (itemId, specialAbility) => {
    console.log(`Purchased item ${itemId} with ability: ${specialAbility}`);
    // Implement purchase logic here 
    // Example: Send a request to the backend to process the purchase
    try {
      const response = await fetch(`${backendURL}/api/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error(`Purchase failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Purchase successful:`, result);
      alert(`You have successfully purchased ${result.item.title}!`);
      // Optionally, update the UI or state based on the purchase
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to purchase the item. Please try again later.');
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
              stroke="#FFD700"
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
                    className={`circle-border color-${index}`} // Dynamic class for borders
                    fill={isCompleted ? 'gold' : '#C0C0C0'}
                  />
                  <text
                    x={positions[index].x}
                    y={positions[index].y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    className={`circle-text color-${index}`} // Dynamic class for text
                  >
                    {index + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Mystery Box */}
          <div className="mystery-box" title="It's a mystery box. Complete your weekly quest to receive a prize!">
            <img
              src={images['/assets/mystery-box-icon.png']}
              alt="Mystery Box"
            />
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="equipment-box">
        <h2 className="box-title">Available Equipment</h2>

        <div className="av-box">
          <p>Complete weekly quests to receive gold!</p>
        </div>

        {/* Dynamic Shop Grid */}
        <div className="shop-grid">
          {shopItems.length > 0 ? (
            shopItems.map((item) => (
              <div className="stat-square shop-square" key={item.id}>
                <div className="image-container" title={item.title2}>
                  <img
                    src={images[item.image] || images['/assets/default.png']}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = images['/assets/default.png']; }}
                  />
                </div>
                <p>{item.title}</p>
                <button
                  className="shop-button"
                  onClick={() => handlePurchase(item.id, item.special_ability)}
                  aria-label={`Buy ${item.title} for ${item.cost} gold`}
                >
                  <GiGoldBar style={{ color: 'gold', fontSize: '24px', marginRight: '8px' }} />
                  {item.cost}
                </button>
              </div>
            ))
          ) : (
            <p>No shop items available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestPage;
