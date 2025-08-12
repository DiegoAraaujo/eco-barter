import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/itemPreview.css";

import CardProduct from "../ui/CardProduct";

// Imagens dos produtos
import Item1 from "../../assets/item1.svg";
import Item2 from "../../assets/item2.svg";
import Item3 from "../../assets/item3.svg";
import Item4 from "../../assets/item4.svg";

function ItemPreview() {
  return (
    <div className="carrousel-container">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          500: { slidesPerView: 2 },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        <SwiperSlide>
          <CardProduct
            image={Item1}
            imageDescription="camisa masculina"
            productName="Jaqueta"
            location="Sobral-CE"
            productState="Estado de novo, nunca usada."
          />
        </SwiperSlide>

        <SwiperSlide>
          <CardProduct
            image={Item2}
            imageDescription="Escrivaninha simples"
            productName="Escrivaninha"
            location="Maracanaú-CE"
            productState="Na caixa ainda, nova."
          />
        </SwiperSlide>

        <SwiperSlide>
          <CardProduct
            image={Item3}
            imageDescription="alexa echo show 5"
            productName="Alexa echo show 5"
            location="Fortaleza-CE"
            productState="Semi-nova, pra vender logo."
          />
        </SwiperSlide>

        <SwiperSlide>
          <CardProduct
            image={Item4}
            imageDescription="Iphone 15"
            productName="Iphone 15"
            location="Ubajara-CE"
            productState="Com poucas marcas de uso."
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default ItemPreview;
