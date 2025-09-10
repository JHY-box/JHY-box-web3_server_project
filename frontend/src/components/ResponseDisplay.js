import React from 'react';

const ResponseDisplay = ({ response, isLoading }) => {
  const getDisplayText = () => {
    if (isLoading) return 'Loading...';
    if (!response) return '(Not called yet)';
    if (typeof response === 'object') {
      return JSON.stringify(response, null, 2);
    }
    return response;
  };

  return (
    <>
      <p className="status">Response:</p>
      <pre>{getDisplayText()}</pre>
    </>
  );
};

export default ResponseDisplay;