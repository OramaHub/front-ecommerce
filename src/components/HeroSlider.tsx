import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import bannerImg from '../assets/banner1.jpg';
import bannerMobileImg from '../assets/banner1mobile.jpg';

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
          <picture>
            <source media="(min-width: 768px)" srcSet={bannerImg} />
            <img src={bannerMobileImg} alt="Banner" className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] object-cover" />
          </picture>
        </SwiperSlide>
        <SwiperSlide>
          <picture>
            <source media="(min-width: 768px)" srcSet={bannerImg} />
            <img src={bannerMobileImg} alt="Banner" className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] object-cover" />
          </picture>
        </SwiperSlide>
        <SwiperSlide>
          <picture>
            <source media="(min-width: 768px)" srcSet={bannerImg} />
            <img src={bannerMobileImg} alt="Banner" className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] object-cover" />
          </picture>
        </SwiperSlide>
        <SwiperSlide>
          <picture>
            <source media="(min-width: 768px)" srcSet={bannerImg} />
            <img src={bannerMobileImg} alt="Banner" className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-170px)] lg:h-[calc(100vh-210px)] object-cover" />
          </picture>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
