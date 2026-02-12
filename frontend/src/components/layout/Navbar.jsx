import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice';
import { FaShippingFast } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      timer: 1500,
      showConfirmButton: false,
    });
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    isActive 
      ? 'bg-primary text-white px-3 py-2 rounded-md text-sm font-medium' 
      : 'text-gray-700 hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm font-medium';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-secondary font-bold text-xl">
              <FaShippingFast className="h-8 w-8 text-primary mr-2" />
              Deliveroo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                  <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
                  <NavLink to="/docs/getting-started" className={navLinkClass}>Docs</NavLink>
                  <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                  {user?.isAdmin && (
                    <NavLink to="/admin" className={navLinkClass}>Admin Panel</NavLink>
                  )}
                  <button onClick={handleLogout} className="bg-secondary text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
                  <NavLink to="/docs/getting-started" className={navLinkClass}>Docs</NavLink>
                  <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                  <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                  <NavLink to="/register" className="bg-primary text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Hamburger Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-primary inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-opacity-90 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? <HiMenu className="block h-6 w-6" /> : <HiX className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- THIS IS THE CORRECTED MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/about" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>About Us</NavLink>
                <NavLink to="/docs/getting-started" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Docs</NavLink>
                <NavLink to="/contact" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Contact</NavLink>
                {user?.isAdmin && (
                  <NavLink to="/admin" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Admin Panel</NavLink>
                )}
                <button onClick={handleLogout} className="w-full text-left bg-secondary text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium block">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/about" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>About Us</NavLink>
                <NavLink to="/docs/getting-started" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Docs</NavLink>
                <NavLink to="/contact" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Contact</NavLink>
                <NavLink to="/login" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={navLinkClass + " block"} onClick={() => setIsOpen(false)}>Register</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;