import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxes, FaShippingFast, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpeg';
import image3 from '../assets/image3.jpeg';
import featureImage from '../assets/delh.jpeg'; 

const slides = [
  {
    title: 'Personal Deliveries, Perfected.',
    description: 'Sending a gift or returning a purchase? We provide secure, door-to-door service for all your personal shipping needs.',
    image: image1,
  },
  {
    title: 'Business Logistics, Simplified.',
    description: 'Empower your business with our reliable delivery network. From small documents to large stock, we ensure your items arrive on time, every time.',
    image: image2,
  },
  {
    title: 'Real-Time Tracking You Can Trust.',
    description: 'Never lose sight of your package. Our live tracking map gives you peace of mind from the moment we pick up until it\'s safely delivered.',
    image: image3,
  },
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const sliderInterval = setInterval(goToNext, 6000); 
    return () => clearInterval(sliderInterval);
  }, [goToNext]);

  return (
    <div className="bg-neutral text-base-text">
      {/* NEW Hero Slider Section */}
      <section className="relative h-[65vh] md:h-[90vh] w-full overflow-hidden bg-gradient-to-r from-primary to-teal-600">
        {/* Slides Container */}
        <div className="w-full h-full">
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{ opacity: slideIndex === currentIndex ? 1 : 0 }}
            >
              <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 items-center px-4 sm:px-6 lg:px-8">
                {/* Left Side: Text Content */}
                <div className="text-white text-left animate-fade-in-up z-10">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">{slide.title}</h1>
                  <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-lg">{slide.description}</p>
                  <div className="mt-8">
                    <Link to="/register" className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-colors">
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* Right Side: Image with Fade Effect */}
                <div className="hidden md:flex justify-center items-center h-full absolute right-0 top-0 w-1/2 lg:w-3/5">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      // This CSS mask creates the fade-to-background effect on the left edge of the image
                      maskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <button onClick={goToPrevious} className="bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition">
            <FiChevronLeft size={28} />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <button onClick={goToNext} className="bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition">
            <FiChevronRight size={28} />
          </button>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-3 h-3 rounded-full transition ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'}`}
            ></button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary mb-12">How It Works in 3 Easy Steps</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-white rounded-full p-6 mb-4"><FaBoxes size={40} /></div>
              <h3 className="text-xl font-semibold mb-2">1. Create Your Order</h3>
              <p className="text-gray-600">Enter the pickup and destination details, along with the parcel weight.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-white rounded-full p-6 mb-4"><FaShippingFast size={40} /></div>
              <h3 className="text-xl font-semibold mb-2">2. We Handle the Pickup</h3>
              <p className="text-gray-600">Our couriers are dispatched to your location to securely collect your parcel.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-white rounded-full p-6 mb-4"><FaMapMarkedAlt size={40} /></div>
              <h3 className="text-xl font-semibold mb-2">3. Track Your Delivery</h3>
              <p className="text-gray-600">Monitor your parcel's journey in real-time right from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-2"><FaShieldAlt className="text-primary mr-3" size={24} /><h3 className="text-2xl font-bold text-secondary">Secure & Reliable</h3></div>
              <p className="text-gray-600">Your trust is our priority. We handle every parcel with the utmost care and ensure it's securely delivered. Our admin-verified updates mean you're always in the loop.</p>
            </div>
            <div>
              <div className="flex items-center mb-2"><FaMapMarkedAlt className="text-primary mr-3" size={24} /><h3 className="text-2xl font-bold text-secondary">Real-Time Tracking</h3></div>
              <p className="text-gray-600">No more guessing. Our live map shows you exactly where your parcel is, from pickup to drop-off, with estimated delivery times powered by real route data.</p>
            </div>
          </div>
          <div className="hidden md:block">
            <img src={featureImage} alt="Delivery Illustration" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary">Ready to Send Your First Parcel?</h2>
          <div className="mt-8">
            <Link to="/register" className="inline-block bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300">Sign Up for Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;