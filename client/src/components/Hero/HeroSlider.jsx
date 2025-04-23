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
      title: "Elevate Your Style",
      description: "Discover a collection that transcends ordinary fashion",
      buttonText: "DISCOVER NOW",
      buttonLink: "/collection/nox-collection-ss1-0"
    },
    {
      id: 2,
      image: "https://wallpaperaccess.com/full/19690.jpg",
      title: "New Arrivals",
      description: "Experience our latest cosmic collection",
      buttonText: "SHOP NEW",
      buttonLink: "/collections/new-arrivals"
    },
    {
      id: 3,
      image: "https://wallpaperaccess.com/full/19691.jpg",
      title: "New Arrivals",
      description: "Experience our latest cosmic collection",
      buttonText: "SHOP NEW",
      buttonLink: "/collection/new-arrivals"
    },
    {
      id: 4,
      image: "https://wallpaperaccess.com/full/19694.jpg",
      title: "New Arrivals",
      description: "Experience our latest cosmic collection",
      buttonText: "SHOP NEW",
      buttonLink: "/collection/new-arrivals"
    }, {
      id: 5,
      image: "https://wallpaperaccess.com/full/19697.jpg",
      title: "New Arrivals",
      description: "Experience our latest cosmic collection",
      buttonText: "SHOP NEW",
      buttonLink: "/collection/new-arrivals"
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
          delay: 1000,
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
