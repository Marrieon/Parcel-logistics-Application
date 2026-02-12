import React from 'react';

const Input = ({ id, name, type = 'text', placeholder, value, onChange, error }) => {
  return (
    <div className="w-full">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg bg-gray-100 border focus:outline-none transition duration-300
                    ${error
                      ? 'border-error focus:border-error'
                      : 'border-gray-200 focus:border-primary'
                    }`}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;