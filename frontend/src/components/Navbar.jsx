import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaHome, FaBox, FaListAlt, FaSignInAlt } from "react-icons/fa"; // Added FaBars and FaTimes, FaListAlt
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Common Nav Links array for reuse
  const navLinks = [
    { to: "/", icon: FaHome, text: "Home" },
    { to: "/products", icon: FaBox, text: "Products" },
    { to: "/orders", icon: FaListAlt, text: "Orders", requiresAuth: true }, 
  ];

  const authLinks = token ? (
    <>
      <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 sm:px-0 sm:py-0">
        <FaUserCircle className="text-xl" />
        <span className="font-medium sm:hidden">Profile</span>
      </div>
      <button onClick={logout} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 sm:px-0 sm:py-0">
        <FaSignOutAlt className="text-xl hover:text-red-500" />
        <span className="font-medium sm:hidden">Logout</span>
      </button>
    </>
  ) : (
    <Link to="/login" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 sm:px-0 sm:py-0">
      <FaSignInAlt className="text-xl" />
      <span className="font-medium sm:hidden">Login</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex justify-between items-center bg-white px-4 py-3 shadow-md md:px-8">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          E-Shop
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {navLinks.filter(link => !link.requiresAuth || token).map(link => (
            <Link key={link.to} to={link.to} className="hover:text-purple-500">
              {link.text}
            </Link>
          ))}
          <Link to="/cart">
            <FaShoppingCart className="text-xl hover:text-purple-500" />
          </Link>
          {authLinks}
        </div>

        <div className="flex items-center sm:hidden">
          <Link to="/cart" className="mr-4">
            <FaShoppingCart className="text-xl hover:text-purple-500" />
          </Link>
          <button onClick={toggleMenu} className="text-2xl text-purple-600">
            <FaBars />
          </button>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 bg-black/50 bg-opacity-50 z-40 transition-opacity ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} sm:hidden`} 
        onClick={toggleMenu}
      ></div>
      
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-purple-600">Navigation</h2>
          <button onClick={toggleMenu} className="text-2xl text-gray-600 hover:text-red-500">
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col">
          {navLinks.filter(link => !link.requiresAuth || token).map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={toggleMenu}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-gray-800"
            >
              <link.icon className="text-lg text-purple-600" />
              {link.text}
            </Link>
          ))}
          <div className="border-t mt-2 pt-2">
            {authLinks}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;