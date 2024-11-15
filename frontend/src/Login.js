import React, { useState } from 'react';
import './styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      onLogin(username);
    }
  };

  //stateful handlelogin
  /*
  const handleLogin = async (username, password) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
        // Pass the username and avatar name to set the logged-in state
        setIsLoggedIn(true);
        setUserName(username);
        setAvatarName(data.avatar);
    } else {
        console.error('Login failed:', data.error);
        alert('Login failed. Please check your credentials.');
    }
};

};
*/

const loginUser = async (username, password) => {
  const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.ok) {
      handleLogin(username, data.avatar);
  } else {
      console.error('Login failed:', data.error);
  }
};

  return (
    <div className="login-page"> {/* Add this wrapper */}
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
