import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import HeroSlideItem from './HeroSlideItem';
import { heroSlides } from './HeroData';
import './HeroSlider.css';

const HeroSlider = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto"> {/* Centered Swiper */}
      <Swiper
        slidesPerView={3}
        spaceBetween={0} // ✅ No extra space
        centeredSlides={false}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
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
            <HeroSlideItem slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
