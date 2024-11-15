import React, { useState } from 'react';
import './styles/App.css';
import * as GiIcons from "react-icons/gi";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import QuestTab from './QuestTab';
import StudyTab from './StudyTab';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import multiavatar from '@multiavatar/multiavatar';

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
              <PrivateRoute isLoggedIn={true}>
                <Home />
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarName, setAvatarName] = useState("default");

  const navigate = useNavigate();

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserName(username);
    navigate('/');
  };

  const handleAvatarChange = () => multiavatar(avatarName);

  return (
    isLoggedIn ? (
      <AppContent
        userName={userName}
        avatarName={avatarName}
        handleAvatarChange={handleAvatarChange}
        setAvatarName={setAvatarName}
      />
    ) : (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  );
};

export default App;