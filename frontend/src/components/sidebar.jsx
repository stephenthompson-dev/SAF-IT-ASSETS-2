import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ArrowLeftStartOnRectangleIcon, CpuChipIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('authToken'); // Example key
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return null; // Do not render sidebar if not authenticated
  }

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${isExpanded ? "w-48" : "w-16"} flex flex-col bg-slate-500 text-white shadow-lg transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ArrowLeftIcon className="h-6 w-6" /> : <ArrowRightIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        {isExpanded ? (
          <img 
            src="frontend/src/simple-logo.png" 
            alt="Logo"
            className="w-24 h-auto"
          />
        ) : (
          <img 
            src="frontend/src/simple-logo.png" 
            alt="Logo"
            className="w-8 h-auto"
          />
        )}
      </div>

      {/* Icons */}
      <SideBarIcon
        icon={<HomeIcon className="h-8 w-8" />}
        text="Home"
        isExpanded={isExpanded}
        path="/"
      />
      <SideBarIcon
        icon={<UserGroupIcon className="h-8 w-8" />}
        text="Users"
        isExpanded={isExpanded}
        path="/users"
      />
      <SideBarIcon
        icon={<CpuChipIcon className="h-8 w-8" />}
        text="Assets"
        isExpanded={isExpanded}
        path="/assets"
      />
      <SideBarIcon
        icon={<BriefcaseIcon className="h-8 w-8" />}
        text="Assignments"
        isExpanded={isExpanded}
        path="/assignments"
      />

      {/* Logout Button at the Bottom */}
      <div className="mt-auto mb-4">
        <SideBarIcon
          icon={<ArrowLeftStartOnRectangleIcon className="h-8 w-8" />}
          text="Logout"
          isExpanded={isExpanded}
          path="/logout"
        />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, text = "tooltip", isExpanded, path, isLogout = false }) => (
  <Link to={path}>
    <div
      className={`sidebar-icon group flex items-center h-12 w-full mt-2 mb-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 cursor-pointer transition-all duration-300 ease-in-out relative ${isExpanded ? "justify-start px-4" : "justify-center"}`}
    >
      {/* Align the icon to the left when expanded, center otherwise */}
      <div className={`${isExpanded ? "mr-4" : ""}`}>
        {icon}
      </div>

      {/* Show text when sidebar is expanded */}
      {isExpanded && (
        <span className="text-sm font-medium">{text}</span>
      )}

      {/* Tooltip when sidebar is collapsed */}
      {!isExpanded && (
        <span className="absolute left-16 bg-slate-700 text-white text-xs font-semibold rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {text}
        </span>
      )}
    </div>
  </Link>
);

export default SideBar;
