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
    image: "https://wallpapers.com/images/high/iphone-11-pro-max-4k-iron-man-r83mbbvynjgzqd8c.webp",
    title: "Iron Man",
    description: "Genius inventor in armor, fighting threats with tech, courage, and sharp wit and and advanced weapons...."
  },
  {
    id: 2,
    image: "https://wallpapercave.com/wp/wp3617696.jpg",
    title: "Captain America",
    description: "Super soldier with a shield, defending freedom and leading the Avengers with honor..."
  },
  {
    id: 3,
    image: "https://cdn.pixabay.com/photo/2024/02/24/15/43/ai-generated-8594264_1280.jpg",
    title: "Thor",
    description: "God of Thunder using Mjölnir to protect Earth with strength and lightning power and  and Asgardian power ."
  },
  {
    id: 4,
    image: "https://wallpaperaccess.com/full/38424.jpg",
    title: "Hulk",
    description: "Scientist turned green giant, smashing enemies with unstoppable rage and brute strength."
  },
  {
    id: 5,
    image: "https://wallpaperaccess.com/full/2388612.jpg",
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
