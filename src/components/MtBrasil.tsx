import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import mt01 from "../assets/mt-brasil/mt-01.jpg";
import mt02 from "../assets/mt-brasil/mt-02.jpg";
import mt03 from "../assets/mt-brasil/mt-03.jpg";
import mt04 from "../assets/mt-brasil/mt-04.jpg";
import mt05 from "../assets/mt-brasil/mt-05.jpg";
import mt06 from "../assets/mt-brasil/mt-06.jpg";
import mt07 from "../assets/mt-brasil/mt-07.jpg";
import mt08 from "../assets/mt-brasil/mt-08.jpg";
import mt09 from "../assets/mt-brasil/mt-09.jpg";
import mt10 from "../assets/mt-brasil/mt-10.jpg";
import mt11 from "../assets/mt-brasil/mt-11.jpg";

import "swiper/css";
import "./MtBrasil.css";

const images = [mt01, mt02, mt03, mt04, mt05, mt06, mt07, mt08, mt09, mt10, mt11];

export function MtBrasil() {
  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 mb-8 md:mb-10">
        <div className="text-center">
          <h2
            className="tracking-wide text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
          >
            MT PELO BRASIL
          </h2>
          <p
            className="text-xs md:text-sm text-gray-600 mt-2 italic"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Histórias reais, marcas que inspiram e o boné que faz parte do seu dia a dia.
          </p>
        </div>
      </div>

      <div className="w-full">
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={5}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          className="mt-brasil-slider"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] lg:w-[248px] lg:h-[248px] overflow-hidden mx-auto">
                <img
                  src={img}
                  alt={`MT pelo Brasil ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 mt-10 md:mt-14">
        <div className="text-center max-w-5xl mx-auto">
          <h3
            className="tracking-wide mb-4 text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            A QUALIDADE QUE SUA MARCA MERECE
          </h3>
          <p
            className="text-gray-700 leading-relaxed mb-3 text-[14px] md:text-[16px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}
          >
            Há mais de uma década, a MT Personalizados transforma ideias em produtos que carregam histórias. Com mais de 4 milhões de itens entregues, unimos tecnologia de ponta e um rigoroso controle de qualidade para criar bonés que não apenas vestem, mas representam.
          </p>
          <p
            className="text-gray-700 leading-relaxed text-[14px] md:text-[16px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}
          >
            Seja para sua empresa, evento ou uso pessoal, entregamos o acabamento profissional de quem é referência no Brasil, garantindo durabilidade e o máximo cuidado com cada detalhe da sua identidade.
          </p>
        </div>
      </div>
    </section>
  );
}
