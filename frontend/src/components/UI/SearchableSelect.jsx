import React, { useState, useEffect } from "react";

const SearchableSelect = ({ options, placeholder, onChange, value }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedOption) => {
    console.log("Selected Option:", selectedOption);
    onChange(selectedOption.value); // Send the ID back to the parent
    setSearchTerm(selectedOption.label); // Set the input to the label
    setIsOpen(false); // Close the dropdown
  };

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option.value === value);
      setSearchTerm(selectedOption ? selectedOption.label : "");
    } else {
      setSearchTerm("");
    }
  }, [value, options]);

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false); // Ensure dropdown closes
    }, 200);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); // Reopen the dropdown when typing
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className="mt-1 block w-full bg-slate-500 text-white border border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 placeholder-gray-400"
        placeholder={placeholder}
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-slate-600 text-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <li className="p-2 text-gray-400">No options available</li>
          ) : (
            filteredOptions.map(option => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)} // Select the option
                className="cursor-pointer hover:bg-indigo-600 p-2"
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
