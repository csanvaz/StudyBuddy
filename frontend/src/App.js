import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import multiavatar from '@multiavatar/multiavatar';
import AppContent from './AppContent.js';
import axios from 'axios';
import backendURL from './config';
import ForgotPassword from './ForgotPassword';
import Helper from './Helper';

const App = () => {
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [avatarName, setAvatarName] = useState('default');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [helperSteps, setHelperSteps] = useState([]);

  const navigate = useNavigate();

  // Fetch state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserName = localStorage.getItem('userName');
    const savedAvatarName = localStorage.getItem('avatarName');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken && savedUserName && savedAvatarName && savedUserId) {
      setToken(savedToken);
      setUserName(savedUserName);
      setAvatarName(savedAvatarName);
      setUserId(savedUserId);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Set helper steps for Carlos
 useEffect(() => {
  if (!isLoggedIn) {
    setHelperSteps([
      { id: 'welcome', title: 'Welcome to the StudyBuddy! My name is Carlos! I am your personal study buddy! We reccomend you use this application in full screen and use your actual email.', image: require('./assets/yeti/yeti1.png') },
      { id: 'ask-registered', title: 'Are you registered yet?', type: 'question', image: require('./assets/yeti/yeti1.png') },
      { id: 'registered', title: 'Great! You are all set! Log in any time!', image: require('./assets/yeti/yeti2.png') },
      { id: 'not-registered', title: 'Not a problem! Go to the Register page to create an account.', image: require('./assets/yeti/yeti1.png') },
      { id: 'post-registration', title: 'Go ahead! I am not looking at your password!', image: require('./assets/yeti/yeti4.png') },
    ]);
  }
}, [isLoggedIn]);
  
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${backendURL}/login`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        setUserName(username);
        setToken(data.token);
        setAvatarName(data.avatar);
        setIsLoggedIn(true);
        setUserId(data.userId);

        // Save state
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', username);
        localStorage.setItem('avatarName', data.avatar);
        localStorage.setItem('userId', data.userId);

        setLoginError('');
        navigate('/');
      } else {
        setLoginError('Invalid credentials, please try again');
      }
    } catch (error) {
      setLoginError('Invalid credentials, please try again');
    }
  };

  const handleRegister = async (username, email, password, onSuccess) => {
    try {
      const response = await axios.post(`${backendURL}/register`, { username, email, password });

      if (response.status === 201) {
        onSuccess();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        alert(`Registration failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  const handleAvatarChange = async (avatarName) => {
    try {
      const response = await axios.post(`${backendURL}/update-avatar`, {
        userId: userId,
        avatar: avatarName,
        token: token,
      });
      if (response.status === 200) {
        multiavatar(avatarName);
        setAvatarName(avatarName);
      } else {
        alert(`Avatar update failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during avatar update:', error);
      alert('An error occurred during avatar update. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setToken('');
    setAvatarName('default');
    setUserId('');
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isLoggedIn && <Helper steps={helperSteps} />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AppContent
                userName={userName}
                avatarName={avatarName}
                handleAvatarChange={handleAvatarChange}
                isLoggedIn={isLoggedIn}
                token={token}
                userId={userId}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} loginError={loginError} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;

