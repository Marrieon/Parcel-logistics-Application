import React from 'react';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    // The bg-secondary now applies to the entire width
    <footer className="bg-secondary text-white">
      {/* The max-w-7xl class is still used to keep the content centered and readable */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info (takes more space on large screens) */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center text-2xl font-bold">
              <FaShippingFast className="h-8 w-8 text-primary mr-3" />
              Deliveroo
            </Link>
            <p className="text-gray-300 text-sm">
              Your reliable partner for fast and secure parcel delivery across the nation. We are committed to bridging distances with speed and care.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigate</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-base text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-base text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-base text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/dashboard" className="text-base text-gray-300 hover:text-white">My Dashboard</Link></li>
              <li><Link to="/docs/getting-started" className="text-base text-gray-300 hover:text-white">Docs</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaPhone className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>+254 781 543801</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>parcels@deliveroo.com</span>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Follow Us</h3>
            <p className="text-gray-400 text-sm mt-4">Stay up to date with our latest news and offers.</p>
            <div className="flex mt-4 space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-white"><FaFacebook size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-300 hover:text-white"><FaTwitter size={24} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-white"><FaInstagram size={24} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-300 hover:text-white"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Deliveroo, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;