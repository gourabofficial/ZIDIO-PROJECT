import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import HeroSlideItem from './HeroSlideItem';
import './HeroSlider.css';

const HeroSlider = () => {
  const heroSlides = [
  {
    id: 1,
    image: "https://wallpaperaccess.com/full/19684.jpg",
    title: "Iron Man",
    description: "Genius inventor in armor, fighting threats with tech, courage, and sharp wit and and advanced weapons...."
  },
  {
    id: 2,
    image: "https://wallpaperaccess.com/full/19690.jpg",
    title: "Captain America",
    description: "Super soldier with a shield, defending freedom and leading the Avengers with honor..."
  },
  {
    id: 3,
    image: "https://wallpaperaccess.com/full/19691.jpg",
    title: "Thor",
    description: "God of Thunder using Mjölnir to protect Earth with strength and lightning power and  and Asgardian power ."
  },
  {
    id: 4,
    image: "https://wallpaperaccess.com/full/19694.jpg",
    title: "Hulk",
    description: "Scientist turned green giant, smashing enemies with unstoppable rage and brute strength."
  },
  {
    id: 5,
    image: "https://wallpaperaccess.com/full/19697.jpg",
    title: "Black Widow",
    description: "Skilled spy and fighter, taking down enemies with stealth, speed, and precision speed, and precision."
  },
];



  return (
    <div className="w-full max-w-[1280px] mx-auto">
      <Swiper
        slidesPerView={3}
        spaceBetween={0}
        centeredSlides={false}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={600}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="hero-swiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
        }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="hero-slide">
            <HeroSlideItem
              key={slide.id}
              slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
