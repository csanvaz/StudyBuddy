import React, { useState } from 'react';
import * as GiIcons from 'react-icons/gi';
import multiavatar from '@multiavatar/multiavatar';

const Home = ({ userName, avatarName, handleAvatarChange, setAvatarName }) => {
  const [inputValue, setInputValue] = useState(avatarName);

  const getXP = () => 150;
  const getStreak = () => 5;
  const getGold = () => 100;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateAvatar = () => {
    setAvatarName(inputValue);
    handleAvatarChange();
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
          <button onClick={handleGenerateAvatar}>
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
              {getGold()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;