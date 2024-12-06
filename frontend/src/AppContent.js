import React, { useState, useEffect } from 'react';
import Home from './Home';
import StudyTab from './StudyTab';
import QuestTab from './QuestTab';
import * as GiIcons from "react-icons/gi";
import SettingsTab from './SettingsTab';

const MenuButton = ({ text, icon: Icon, isActive, onClick }) => {
  return (
    <button onClick={onClick} className={`menu-button ${isActive ? 'active' : ''}`}>
      {Icon && <Icon style={{ marginRight: '10px', fontSize: '20px' }} />}
      {text}
    </button>
  );
};

const AppContent = ({ userName, avatarName, handleAvatarChange, userId, token, onLogout}) => {
  const [currentTab, setCurrentTab] = useState(localStorage.getItem("currentTab") || 'home');

  //save current tab
  useEffect(() => {
    localStorage.setItem('currentTab', currentTab);
  }, [currentTab]);

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <Home
            userName={userName}
            avatarName={avatarName}
            handleAvatarChange={handleAvatarChange}
            userId={userId}
          />
        );
      case 'study':
        return <StudyTab userId={userId} token={token}/>;
      case 'quest':
        return <QuestTab userId={userId} token={token}/>;
      case 'settings':
        return <SettingsTab userId={userId}/>;
      default:
        return null;
    }
  };

  
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
          isActive={currentTab === 'home'}
          onClick={() => setCurrentTab('home')}
        />
        <MenuButton
          text="STUDY"
          icon={GiIcons.GiBlackBook}
          isActive={currentTab === 'study'}
          onClick={() => setCurrentTab('study')}
        />
        <MenuButton
          text="QUEST"
          icon={GiIcons.GiHiking}
          isActive={currentTab === 'quest'}
          onClick={() => setCurrentTab('quest')}
        />
        <MenuButton
        text="SETTINGS"
        icon={GiIcons.GiSettingsKnobs}
        isActive={currentTab === 'settings'}
        onClick={() => setCurrentTab('settings')}
        />
        <MenuButton
          text="LOGOUT"
          icon={GiIcons.GiExitDoor}
          isActive={false} 
          onClick={onLogout}
        />
      </div>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AppContent;