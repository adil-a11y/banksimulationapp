import React from 'react';

const Card = ({ children, className = '', title, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Card;
