import React, { useState, useEffect } from 'react';
import * as GiIcons from 'react-icons/gi';
import multiavatar from '@multiavatar/multiavatar';
import backendURL from './config';
import Draggable from 'react-draggable';
import Helper from './Helper'; // Import Helper component for Carlos

const Home = ({ userName, avatarName, handleAvatarChange, userId }) => {
  const [inputValue, setInputValue] = useState(avatarName);
  const [gold, setGold] = useState(0);
  const [xp, getXP] = useState(0); 
  const [streak, getStreak] = useState(0);
  const [helperSteps, setHelperSteps] = useState([]);
  const [showHelper, setShowHelper] = useState(true);

  // Helper steps for Carlos the Yeti on the home page
  useEffect(() => {
    setHelperSteps([
      {
        id: 'welcome-main',
        title: 'Welcome to the main page! Here, you can see your avatar.',
        image: require('./assets/yeti/yeti1.png'),
      },
      {
        id: 'stats-info',
        title: 'Beneath your avatar, you can view your stats.',
        image: require('./assets/yeti/yeti8.png'),
      },
      {
        id: 'xp-info',
        title: 'You earn XP for completing each lesson.',
        image: require('./assets/yeti/yeti3.png'),
      },
      {
        id: 'streak-info',
        title: "Your streak shows how many consecutive days you've been studying.",
        image: require('./assets/yeti/yeti2.png'),
      },
      {
        id: 'gold-info',
        title: 'You earn gold for study-related actions and completing quests.',
        image: require('./assets/yeti/yeti1.png'),
      },
]);
  }, []);

  // Fetch gold amount

  // CHANGE FETCH URL TO USE THE CORRECT ENDPOINT
  useEffect(() => {
    const fetchGold = async () => {
      try {
        const response = await fetch(`${backendURL}/user/${userId}/gold`);
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
  }, [userId]);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const response = await fetch(`${backendURL}/user/${userName}/xp`);
        const data = await response.json();
        if (data.success) {
          getXP(data.xp);
        } else {
          console.error('Error fetching XP:', data.message);
        }
      } catch (error) {
        console.error('Error fetching XP:', error);
      }
    };

    fetchXP();
  }, [userName]);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch(`${backendURL}/user/${userName}/streak`);
        const data = await response.json();
        if (data.success) {
          getStreak(data.streak);
        } else {
          console.error('Error fetching streak:', data.message);
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
      }
    };

    fetchStreak();
  }, [userName]);

  // const getXP = () => 150;
  // const getStreak = () => 5;
  //const getGold = () => 100;

  // CHANGE FETCH URL TO USE THE CORRECT ENDPOINT
  const handleAddGold = async () => {
    const goldEarned = 500;
    try {
      const response = await fetch(`${backendURL}/update-gold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, goldEarned }),
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
    {/* Carlos the Yeti Helper */}
      {showHelper && <Helper steps={helperSteps} onClose={() => setShowHelper(false)} />}

      {/* Main content */}
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
            <div className="stat-square xp-square">XP: {xp}</div>
            <div className="stat-square streak-square">Streak: {streak}</div>
            <div className="stat-square gold-square">
              <GiIcons.GiGoldBar style={{ color: '#ef7971', fontSize: '24px', marginRight: '8px' }} />
              Gold: {gold}
            </div>
          </div>
            <button onClick={handleAddGold} className="add-gold-button">
                Add 500 Gold
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
