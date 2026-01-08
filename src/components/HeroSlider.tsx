import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import './HeroSlider.css';

export function HeroSlider() {
  return (
    <div className="slider-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="hero-slider"
      >
        <SwiperSlide>
          <div className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] bg-gray-200"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] bg-gray-300"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] bg-gray-400"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] bg-gray-500"></div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
