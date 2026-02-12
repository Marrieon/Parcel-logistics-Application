import { useState, useEffect } from 'react';

const useImageSlideshow = (images, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);

      // Cleanup the interval on component unmount
      return () => clearInterval(timer);
    }
  }, [images, interval]);

  // Return the image at the current index, or a default/fallback if the array is empty
  return images && images.length > 0 ? images[currentIndex] : null;
};

export default useImageSlideshow;