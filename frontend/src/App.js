import React, { useState } from 'react';
import './styles/App.css';
import * as GiIcons from "react-icons/gi";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import QuestTab from './QuestTab';
import StudyTab from './StudyTab';
import Login from './Login';
import multiavatar from '@multiavatar/multiavatar';

const getXP = () => 150;
const getStreak = () => 5;
const getGold = () => 100;

const MenuButton = ({ text, icon: Icon, isActive, path }) => {
  return (
    <Link to={path} className={`menu-button ${isActive ? 'active' : ''}`}>
      {Icon && <Icon style={{ marginRight: '10px', fontSize: '20px' }} />}
      {text}
    </Link>
  );
};

const AppContent = ({ userName, avatarName, handleAvatarChange, setAvatarName }) => {
  const location = useLocation(); // Now inside Router context

  return (
    <div className="app">
      <div className="mountain-background">
        <div className="mountain"></div>
        <div className="mountain"></div>
        <div className="mountain"></div>
      </div>

      <div className="sidebar">
        <MenuButton
          text="HOME"
          icon={GiIcons.GiHouse}
          isActive={location.pathname === '/'}
          path="/"
        />
        <MenuButton
          text="STUDY"
          icon={GiIcons.GiBlackBook}
          isActive={location.pathname === '/study'}
          path="/study"
        />
        <MenuButton
          text="QUEST"
          icon={GiIcons.GiHiking}
          isActive={location.pathname === '/quest'}
          path="/quest"
        />
      </div>

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
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
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                  />
                  <button onClick={() => handleAvatarChange()}>
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
            }
          />
          <Route path="/study" element={<StudyTab />} />
          <Route path="/quest" element={<QuestTab />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarName, setAvatarName] = useState("default");

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserName(username);
  };

  const handleAvatarChange = () => multiavatar(avatarName);

  return (
    <Router>
      {isLoggedIn ? (
        <AppContent
          userName={userName}
          avatarName={avatarName}
          handleAvatarChange={handleAvatarChange}
          setAvatarName={setAvatarName}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;
