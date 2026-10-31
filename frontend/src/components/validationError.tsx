import React from 'react';

interface ValidationErrorProps {
  message: string | null;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ message }) => {
  return (
    <div className="validation-error-container">
      <span className={`validation-error-text ${message ? 'visible' : 'hidden'}`}>
        {message}
      </span>
    </div>
  );
};

export default ValidationError;