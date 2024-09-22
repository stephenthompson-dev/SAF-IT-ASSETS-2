import React from 'react';

const ExpandableButton = ({ onClick, icon: IconComponent, text }) => {
    return (
      <button
        onClick={onClick}
        className="relative flex items-center justify-center w-12 h-12 bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-all duration-300 group"
      >
        {/* Icon */}
        <IconComponent className="h-5 w-5" />

        {/* Expandable Text */}
        <span className="absolute left-14 opacity-0 group-hover:opacity-100 group-hover:left-16 whitespace-nowrap bg-slate-600 text-white px-2 py-1 rounded-md transition-all duration-300">
          {text}
        </span>
      </button>
    );
  };

export default ExpandableButton;
