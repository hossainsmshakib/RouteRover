import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import {
  FaPlane,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaMap,
  FaSignInAlt,
  FaUserPlus,
  FaChartBar,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-blue-600 border-b-2 border-blue-600"
      : "";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaPlane className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-semibold text-lg text-gray-800">
                TravelPlanner
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/itinerary"
                    className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 ${isActive(
                      "/itinerary"
                    )} hover:text-blue-600 transition-colors duration-200`}
                  >
                    <FaMap className="mr-2" />
                    Itineraries
                  </Link>
                  <Link
                    to="/summary"
                    className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 ${isActive(
                      "/summary"
                    )} hover:text-blue-600 transition-colors duration-200`}
                  >
                    <FaChartBar className="mr-2" />
                    Summary
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-blue-600 rounded hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 ${isActive(
                      "/"
                    )} hover:text-blue-600 transition-colors duration-200`}
                  >
                    <FaSignInAlt className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-blue-600 rounded hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaUserPlus className="mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/itinerary"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 ${isActive(
                    "/itinerary"
                  )} hover:text-blue-600 transition-colors duration-200`}
                >
                  <FaMap className="mr-2" />
                  Itineraries
                </Link>
                <Link
                  to="/summary"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 ${isActive(
                    "/summary"
                  )} hover:text-blue-600 transition-colors duration-200`}
                >
                  <FaChartBar className="mr-2" />
                  Summary
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 ${isActive(
                    "/"
                  )} hover:text-blue-600 transition-colors duration-200`}
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <FaUserPlus className="mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
