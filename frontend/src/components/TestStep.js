import React from 'react';
import ResponseDisplay from './ResponseDisplay';

const TestStep = ({ 
  title, 
  buttonText, 
  onButtonClick, 
  response, 
  isLoading, 
  disabled = false 
}) => {
  return (
    <div className="step">
      <h2>{title}</h2>
      <button 
        onClick={onButtonClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? '로딩 중...' : buttonText}
      </button>
      <ResponseDisplay response={response} isLoading={isLoading} />
    </div>
  );
};

export default TestStep;