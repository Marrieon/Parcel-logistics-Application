import React from 'react';
import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;