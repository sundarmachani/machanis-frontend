import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let dropdownTimeout;

  // Function to show dropdown
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout);
    setDropdownOpen(true);
  };

  // Function to hide dropdown with a delay
  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // Small delay to allow smooth transition
  };

  return (
    <nav className="bg-[#2c2f33] p-4 text-[#d1d5db] shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#f97316] hover:text-[#ea580c] font-[Lobster]"
        >
          Machani's
        </Link>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-[#f97316] transition">
            Home
          </Link>
          <Link
            to="/cart"
            className="flex items-center hover:text-[#f97316] transition"
          >
            <FaShoppingCart className="mr-1" /> Cart
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-[#f97316] transition">
              My Orders
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className="hover:text-[#f97316] transition">
              Admin
            </Link>
          )}
        </div>

        {/* Right Section: User Account & Auth Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center space-x-2 hover:text-[#f97316] transition">
                <FaUserCircle className="text-xl" />
                <span>{user.name || "Account"}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-[#2c2f33] rounded-md shadow-lg z-10"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-[#3b3e42] rounded-t-md"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setTimeout(() => navigate("/login"), 100);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3b3e42] rounded-b-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#f97316] transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-[#f97316] transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center bg-[#2c2f33] p-4 rounded-lg">
          <Link to="/" className="block hover:text-[#f97316] transition">
            Home
          </Link>
          <Link to="/cart" className="block hover:text-[#f97316] transition">
            Cart
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block hover:text-[#f97316] transition"
            >
              My Orders
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className="block hover:text-[#f97316] transition">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="block hover:text-[#f97316] transition"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setTimeout(() => navigate("/login"), 100);
                }}
                className="block text-red-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-[#f97316] transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-[#f97316] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
