
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ContactForm from '../features/contact/ContactForm'; // Correctly imports the form
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

// Fix for default Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ContactPage = () => {
  // Coordinates for Nairobi Railways Terminus
  const position = [-1.2925, 36.8245]; 

  return (
    <div className="bg-neutral">
      {/* Header */}
       <header className="bg-secondary text-white text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold">Get In Touch</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">We'd love to hear from you. Here's how you can reach us.</p>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-secondary">Contact Information</h2>
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-primary h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Our Office</h3>
                <p className="text-base-text">Nairobi Railways Terminus, Nairobi, Kenya</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhone className="text-primary h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-base-text">+254 781 543801</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-primary h-6 w-6 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-base-text">support@deliveroo.com</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            {/* The ContactForm component is rendered here */}
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 h-96 rounded-lg shadow-lg overflow-hidden">
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Deliveroo Nairobi Office
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;