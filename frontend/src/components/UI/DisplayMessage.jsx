import React, { useEffect } from 'react';

const DisplayMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`p-4 transition-all duration-300 ease-in-out text-center font-bold mb-4 ${type === 'error' ? 'bg-red-500 bg-opacity-30' : 'bg-green-500 bg-opacity-30'
        }`}
    >
      <div className="flex justify-between items-center">
        <span className="flex-1 text-center">{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          &times;
        </button>
      </div>
    </div>
  );
};

export default DisplayMessage;
