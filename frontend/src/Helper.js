import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useNavigate } from 'react-router-dom'; // Import navigate
import './styles/Helper.css';

const Helper = ({ steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStep.id === 'registered') {
      // Close Carlos after the final step
      setIsMinimized(true);
      return;
    }

    if (currentStep.id === 'not-registered') {
      // Redirect to the registration page after "Not a problem" step
      navigate('/register');
      setCurrentStepIndex(steps.findIndex((step) => step.id === 'post-registration'));
      return;
    }

    if (currentStep.id === 'post-registration') {
      // Close Carlos after the registration message
      setIsMinimized(true);
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const handleRegisteredChoice = (choice) => {
    if (choice === 'yes') {
      setCurrentStepIndex(steps.findIndex((step) => step.id === 'registered'));
    } else if (choice === 'no') {
      setCurrentStepIndex(steps.findIndex((step) => step.id === 'not-registered'));
    }
  };

  return isMinimized ? (
    <div className="helper-minimized" onClick={handleToggle}>
      <img src={require('./assets/yeti/yeti7.png')} alt="Carlos Minimized" />
    </div>
  ) : (
    <Draggable>
      <div className="helper-container">
        <div className="helper-header">
          Carlos the Yeti
          <button className="helper-close-button" onClick={handleToggle}>
            X
          </button>
        </div>
        <div className="helper-content">
          {currentStep.image && (
            <img src={currentStep.image} alt="Yeti" className="helper-image" />
          )}
          <div className="helper-text">
            <p>{currentStep.title}</p>
            <div className="helper-buttons">
              {currentStep.type === 'question' ? (
                <>
                  <button
                    className="helper-button"
                    onClick={() => handleRegisteredChoice('yes')}
                  >
                    Yes
                  </button>
                  <button
                    className="helper-button"
                    onClick={() => handleRegisteredChoice('no')}
                  >
                    No
                  </button>
                </>
              ) : (
                <button className="helper-button" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Helper;

