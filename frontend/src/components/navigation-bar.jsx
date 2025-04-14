import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600';
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Website Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">W3</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-slate-800">Web3 Exam</h1>
                <p className="text-xs text-slate-500">Decentralized Testing Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about"
              className={`${isActive('/about')} font-medium transition-colors duration-200`}
            >
              About Us
            </Link>
            <Link 
              to="/contact"
              className={`${isActive('/contact')} font-medium transition-colors duration-200`}
            >
              Contact Us
            </Link>
            <Link 
              to="/faqs"
              className={`${isActive('/faqs')} font-medium transition-colors duration-200`}
            >
              FAQs
            </Link>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-b border-slate-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about')} hover:bg-slate-50`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact')} hover:bg-slate-50`}
          >
            Contact Us
          </Link>
          <Link
            to="/faqs"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/faqs')} hover:bg-slate-50`}
          >
            FAQs
          </Link>
          <button className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
