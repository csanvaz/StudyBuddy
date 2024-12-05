import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = ({ onLogin, loginError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    setUserError(!username);
    setPassError(!password);

    if (!username || !password) return;

    onLogin(username, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {loginError && <div className="error-message">{loginError}</div>}
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {setUsername(e.target.value); if (userError) setUserError(false);}}
          style = {{borderColor: userError ? 'red' : ''}}
        />
        {userError && <div className="error-message">Username is required</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {setPassword(e.target.value); if (passError) setPassError(false);}}
          style = {{borderColor: passError ? 'red' : ''}}
        />
        {passError && <div className="error-message">Password is required</div>}
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate('/register')}>Go to Register</button>
      </div>
    </div>
  );
};

export default Login;