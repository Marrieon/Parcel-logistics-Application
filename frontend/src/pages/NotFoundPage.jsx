import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral">
      <h1 className="text-6xl font-bold text-secondary">404</h1>
      <h2 className="text-2xl font-semibold text-base-text mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;