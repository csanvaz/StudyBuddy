import React from 'react';
import * as GiIcons from 'react-icons/gi'; // Import all icons as GiIcons

const Home = () => {
  const getXP = () => 150;
  const getStreak = () => 5;
  const getGold = () => 100;
  const getUserName = () => "@user name";

  return (
    <div className="content">
      <div className="welcome-stats-container">
        <h1 className="welcome-text">Welcome, {getUserName()}!</h1>

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
