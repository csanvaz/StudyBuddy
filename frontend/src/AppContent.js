import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Home from './Home';
import StudyTab from './StudyTab';
import QuestTab from './QuestTab';
import * as GiIcons from "react-icons/gi";

const MenuButton = ({ text, icon: Icon, isActive, path }) => {
  return (
    <Link to={path} className={`menu-button ${isActive ? 'active' : ''}`}>
      {Icon && <Icon style={{ marginRight: '10px', fontSize: '20px' }} />}
      {text}
    </Link>
  );
};

const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

const AppContent = ({ userName, avatarName, handleAvatarChange, setAvatarName }) => {
  const location = useLocation();

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
              <PrivateRoute isLoggedIn={true}>
                <Home
                  userName={userName}
                  avatarName={avatarName}
                  handleAvatarChange={handleAvatarChange}
                  setAvatarName={setAvatarName}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/study"
            element={
              <PrivateRoute isLoggedIn={true}>
                <StudyTab />
              </PrivateRoute>
            }
          />
          <Route
            path="/quest"
            element={
              <PrivateRoute isLoggedIn={true}>
                <QuestTab />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;