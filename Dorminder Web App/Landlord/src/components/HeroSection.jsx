import React from 'react';
import bannerImage from '../assets/banner/banner_login.png';

const HeroSection = () => {
  return (
    <div 
      className="lg:w-1/2 relative overflow-hidden flex items-center justify-center px-8 py-16 lg:py-0"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-left text-white z-10 max-w-2xl">
        <h1 className="text-8xl lg:text-7xl font-normal mb-2 leading-tight">
          Hello, <span className="block font-extrabold">Welcome!</span>
        </h1>
        <p className="text-3xl leading-relaxed opacity-90 mb-12 max-w-3xl">
          Manage your dormitory with ease. From tenant records to rent monitoring, 
          Dorminder keeps everything organized in one place.
        </p>

        <div className="absolute bottom-8 left-0 right-0 z-10">
          <p className="text-base font-medium text-center text-white">
            Your Dorm, Your Control.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
