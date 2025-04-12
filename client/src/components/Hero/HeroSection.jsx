import React from 'react';
import HeroTitle from './HeroTitile';
import HeroSlider from './HeroSlider';

const HeroSection = () => {
  return (
    <section className='w-full relative py-16 bg-[#0c0e16] animate-fadeIn'>
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      <HeroTitle />
      <HeroSlider />
    </section>
  );
};

export default HeroSection;