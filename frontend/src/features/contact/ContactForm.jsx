import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import apiClient from '../../api/apiClient'; // Import our apiClient

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Your name is required';
    if (!formData.email) {
      newErrors.email = 'Your email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.message) newErrors.message = 'Please enter a message';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    
    try {
      // Make the actual API call to the backend
      const response = await apiClient.post('/api/contact', formData);
      
      setStatus('succeeded');
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: response.data.message, // Use the success message from the backend
      });
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      setStatus('failed');
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="text-2xl font-bold text-secondary mb-6">Send Us a Message</h3>
      <div className="space-y-6">
        <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} error={errors.name} />
        <Input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} error={errors.email} />
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-3 rounded-lg bg-gray-100 border focus:outline-none transition duration-300
                        ${errors.message
                          ? 'border-error focus:border-error'
                          : 'border-gray-200 focus:border-primary'
                        }`}
          ></textarea>
          {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
        </div>
        <Button type="submit" isLoading={status === 'loading'} fullWidth>
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;