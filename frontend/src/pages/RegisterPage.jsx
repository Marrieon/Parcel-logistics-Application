import React from 'react';
import RegisterForm from '../features/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral p-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;