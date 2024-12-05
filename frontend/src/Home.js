import React, { useState, useEffect } from 'react';
import * as GiIcons from 'react-icons/gi';
import multiavatar from '@multiavatar/multiavatar';

//CHANGE THE FETCH PATHS FOR LOCAL TESTING // PROD

const Home = ({ userName, avatarName, handleAvatarChange }) => {
  const [inputValue, setInputValue] = useState(avatarName);
  const [gold, setGold] = useState(0);


  // CHANGE FETCH URL TO USE THE CORRECT ENDPOINT
  useEffect(() => {
    const fetchGold = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/${userName}/gold`);
        const data = await response.json();
        if (data.success) {
          setGold(data.gold);
        } else {
          console.error('Error fetching gold:', data.message);
        }
      } catch (error) {
        console.error('Error fetching gold:', error);
      }
    };

    fetchGold();
  }, [userName]);

  const getXP = () => 150;
  const getStreak = () => 5;
  //const getGold = () => 100;

  // CHANGE FETCH URL TO USE THE CORRECT ENDPOINT
  const handleAddGold = async () => {
    const goldEarned = 500;
    try {
      const response = await fetch('http://localhost:8080/update-gold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, goldEarned }),
      });
      const data = await response.json();
      if (data.success) {
        setGold(data.gold);
      } else {
        console.error('Error updating gold:', data.message);
      }
    } catch (error) {
      console.error('Error updating gold:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="content">
      <div className="welcome-stats-container">
        <h1 className="welcome-text">Welcome, {userName}!</h1>
        {/* Avatar Display */}
        <div className="avatar-container">
          <div dangerouslySetInnerHTML={{ __html: multiavatar(avatarName) }} />
        </div>
        {/* Avatar Name Input */}
        <div className="avatar-input">
          <input
            type="text"
            placeholder="Enter avatar name"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={() => handleAvatarChange(inputValue)}>
            Generate Avatar
          </button>
        </div>
        <div className="stats-container">
          <p className="stats-title">Your statistics:</p>
          <div className="stats-grid">
            <div className="stat-square xp-square">XP: {getXP()}</div>
            <div className="stat-square streak-square">Streak: {getStreak()}</div>
            <div className="stat-square gold-square">
              <GiIcons.GiGoldBar style={{ color: '#ef7971', fontSize: '24px', marginRight: '8px' }} />
              Gold: {gold}
            </div>
          </div>
            <button onClick={handleAddGold} className="add-gold-button">
                Add 10 Gold
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;