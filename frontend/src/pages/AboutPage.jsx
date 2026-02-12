import React from 'react';
// CORRECTED IMPORT LINE
import { FaBullseye, FaHistory, FaHeart, FaShippingFast, FaShieldAlt } from 'react-icons/fa';

// Import your gallery images
import gallery1 from '../assets/gallery1.jpg';
import gallery2 from '../assets/gallery2.jpg';
import gallery3 from '../assets/gallery3.jpg';
import gallery4 from '../assets/gallery4.jpg';

const AboutPage = () => {
  const galleryImages = [gallery1, gallery2, gallery3, gallery4];

  return (
    <div className="bg-neutral">
      {/* Page Header */}
      <header className="bg-secondary text-white text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold">About Deliveroo</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Connecting people and businesses, one parcel at a time.</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Mission & Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="flex items-start">
              <FaBullseye className="text-primary h-8 w-8 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-secondary">Our Mission</h2>
                <p className="mt-2 text-base-text">
                  To provide the most reliable, efficient, and user-friendly parcel delivery service. We aim to bridge distances by ensuring that every package, big or small, is delivered with care and precision, empowering individuals and businesses to thrive.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaHistory className="text-primary h-8 w-8 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-secondary">Our Story</h2>
                <p className="mt-2 text-base-text">
                  Founded on the simple idea that sending a parcel should be as easy as sending a text message, Deliveroo started as a solution to a common problem: complicated and untrustworthy delivery services. We've since grown into a trusted network, committed to transparency and exceptional customer service.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img src={gallery1} alt="Our team at work" className="rounded-lg shadow-xl" />
          </div>
        </section>

        {/* Our Values Section */}
        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold text-secondary mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <FaHeart className="text-primary h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">Your satisfaction is the driving force behind everything we do.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <FaShippingFast className="text-primary h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Speed & Efficiency</h3>
              <p className="text-gray-600">We optimize every route and process to ensure your parcels arrive on time.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <FaShieldAlt className="text-primary h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unwavering Integrity</h3>
              <p className="text-gray-600">We operate with transparency, honesty, and a commitment to security.</p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-secondary mb-10">Trusted in Action</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image} 
                  alt={`Deliveroo in action ${index + 1}`} 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ease-in-out" 
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;