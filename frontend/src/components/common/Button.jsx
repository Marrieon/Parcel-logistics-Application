import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, type = 'button', onClick, isLoading = false, fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        px-6 py-3 rounded-lg font-bold text-white bg-primary hover:bg-opacity-90 
        transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        flex items-center justify-center
        ${isLoading ? 'cursor-not-allowed opacity-75' : ''}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;