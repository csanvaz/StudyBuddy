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

      <div className="monsta-container">
        <div className="monsta">
          <img src={require('./assets/monsta.png')} alt="Monsta" />
        </div>
        <div className="monsta-text">Join us today and study away!</div>
      </div>


      <div className="background-elements">
        <div className="quote" style={{ top: '10%', left: '5%' }}>
          "This platform is revolutionizing the way students learn. A must-visit for anyone eager to excel in their studies."
          <span>- Future Minds Magazine</span>
        </div>
        <div className="quote" style={{ top: '30%', left: '70%' }}>
          "The most comprehensive and engaging resource for lifelong learners."
          <span>- Global Education Weekly</span>
        </div>
        <div className="quote" style={{ top: '80%', left: '40%' }}>
          "Our students have shown remarkable improvement in their academic performance thanks to this website."
          <span>- Institute of Modern Learning</span>
        </div>

        <div className="symbol" style={{ top: '5%', left: '50%' }}>📚</div>
        <div className="symbol" style={{ top: '45%', left: '10%' }}>✏️</div>
        <div className="symbol" style={{ top: '90%', left: '80%' }}>🎓</div>
        <div className="symbol" style={{ top: '60%', left: '20%' }}>📖</div>
        <div className="symbol" style={{ top: '50%', left: '30%' }}>🖋️</div>
        <div className="symbol" style={{ top: '90%', left: '15%' }}>🏫</div>
        <div className="symbol" style={{ top: '10%', left: '80%' }}>🧑‍🎓</div>
        <div className="symbol" style={{ top: '70%', left: '90%' }}>📎</div>
        <div className="symbol" style={{ top: '5%', left: '20%' }}>💻</div>
        <div className="symbol" style={{ top: '25%', left: '60%' }}>🔬</div>
        <div className="symbol" style={{ top: '60%', left: '85%' }}>📐</div>
        <div className="symbol" style={{ top: '75%', left: '70%' }}>🧪</div>
      </div>


      <div className="login-container">
        <div className="instruction">Login or register to get started</div>
        {loginError && <div className="error-message">{loginError}</div>}
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); if (userError) setUserError(false); }}
          style={{ borderColor: userError ? 'red' : '' }}
        />
        {userError && <div className="error-message">Username is required</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passError) setPassError(false); }}
          style={{ borderColor: passError ? 'red' : '' }}
        />
        {passError && <div className="error-message">Password is required</div>}
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate('/register')}>Go to Register</button>
      </div>
    </div>
  );
};

export default Login;