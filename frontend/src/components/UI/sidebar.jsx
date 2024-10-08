import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { TagIcon, HomeIcon, UserGroupIcon, CpuChipIcon, BriefcaseIcon, ArrowLeftStartOnRectangleIcon, MagnifyingGlassPlusIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useAuth } from "../../contexts/AuthContext";

const SideBar = () => {
    const [isExpanded, setIsExpanded] = useState(false); // State to control sidebar expansion
    const { logout } = useAuth();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen ${isExpanded ? "w-48" : "w-16"
                    } flex flex-col bg-slate-500 text-white shadow-lg transition-all duration-300 z-50`}
            >
                {/* Toggle Button */}
                <div className="flex items-center justify-between p-4">
                    <button
                        className="text-white focus:outline-none"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
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
                <SideBarIcon
                    icon={<MagnifyingGlassPlusIcon className="h-8 w-8" />}
                    text="Requests"
                    isExpanded={isExpanded}
                    path="/requests"
                />
                <SideBarIcon
                    icon={<TagIcon className="h-8 w-8" />}
                    text="Categories"
                    isExpanded={isExpanded}
                    path="/categories"
                />
                {/* Logout Button at the Bottom */}
                <div className="mt-auto mb-4">
                    <SideBarIcon
                        onClick={logout}
                        icon={<ArrowLeftStartOnRectangleIcon className="h-8 w-8" />}
                        text="Logout"
                        isExpanded={isExpanded}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`MAX-W flex-1 ml-16 transition-all duration-300 ${isExpanded ? "ml-48" : "ml-16"}`}
            >
                <div className="px-20 py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const SideBarIcon = ({ icon, text = "tooltip", isExpanded, path, onClick }) => (
    <Link to={path ? path : null} onClick={onClick ? onClick : null}>
        <div
            className={`sidebar-icon group flex items-center h-12 w-full mt-2 mb-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 cursor-pointer transition-all duration-300 ease-in-out ${path === "/logout"
                } relative ${isExpanded ? "justify-start px-4" : "justify-center"}`}
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
                <span className="absolute left-16 ml-1 bg-slate-700 text-white text-xs font-semibold rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {text}
                </span>
            )}
        </div>
    </Link>
);

export default SideBar;
