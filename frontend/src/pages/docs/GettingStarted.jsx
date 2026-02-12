import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';

const GettingStarted = () => {
  return (
    <article className="prose prose-lg max-w-none text-base-text">
      <h1 className="text-secondary">Getting Started</h1>
      <p className="lead">
        Welcome to Deliveroo! We're thrilled to have you. This guide will quickly walk you through setting up your account so you can start shipping parcels in minutes.
      </p>

      <div className="mt-12 space-y-8">
        <div className="flex items-start">
          <FiUserPlus className="h-8 w-8 text-primary mr-6 mt-1 flex-shrink-0" />
          <div>
            <h2 className="mt-0">1. Create Your Account</h2>
            <p>
              To begin, you'll need a free Deliveroo account. This gives you access to your personal dashboard where all your delivery magic happens.
            </p>
            <ol>
              <li>Start by navigating to our secure <Link to="/register">Registration Page</Link>.</li>
              <li>Fill out the form with your details. Choose a username, provide a valid email, and create a strong password.</li>
              <li>Click the "Create Account" button to finish. You'll be automatically taken to the login page.</li>
            </ol>
          </div>
        </div>
        
        <div className="flex items-start">
          <FiLogIn className="h-8 w-8 text-primary mr-6 mt-1 flex-shrink-0" />
          <div>
            <h2>2. Log In to Your Dashboard</h2>
            <p>
              Once your account is created, logging in is simple.
            </p>
            <ol>
              <li>Go to the <Link to="/login">Login Page</Link>.</li>
              <li>Enter the email and password you just created.</li>
              <li>Click "Login".</li>
            </ol>
            <p>
              That's it! You are now logged in and will be redirected to your dashboard, ready to create your first parcel order.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GettingStarted;