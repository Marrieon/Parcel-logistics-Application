import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Replace with your actual phone number in international format (without '+', '00', or brackets)
  const phoneNumber = '+254781543801'; // Example: Use your country code and number

  // The pre-filled message. URL encode will handle spaces and special characters.
  const message = "Hello Deliveroo! I have a question about my parcel delivery.";
  
  // Create the WhatsApp API link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white 
                 w-16 h-16 rounded-full flex items-center justify-center 
                 shadow-lg transform hover:scale-110 transition-transform duration-300 z-50"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppButton;