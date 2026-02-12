import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const docsLinks = [
  { name: 'Getting Started', path: '/docs/getting-started' },
  { name: 'Managing Parcels', path: '/docs/managing-parcels' },
  { name: 'For Admins', path: '/docs/for-admins' },
  { name: 'FAQ', path: '/docs/faq' },
];

const DocsLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const SidebarContent = () => (
    <nav className="space-y-1">
      {docsLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={navLinkClass}
          onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile nav click
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:flex">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden mb-4 flex justify-end">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            <span className="sr-only">Toggle Docs Menu</span>
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`lg:w-64 lg:flex-shrink-0 lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-4">Documentation</h2>
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:flex-grow lg:ml-8 mt-8 lg:mt-0">
          <div className="p-6 sm:p-8 bg-white rounded-lg shadow-sm min-h-[500px]">
            {/* The content for each section will be rendered here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;