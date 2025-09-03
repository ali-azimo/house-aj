import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import HouseItems from "../components/HouseItems";

export default function Home() {
  const [offerHouses, setOfferHouses] = useState([]);
  const [saleHouses, setSaleHouses] = useState([]);
  const [rentHouses, setRentHouses] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchHouses = async (url, setter) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setter(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Erro ao buscar casas:", error);
      }
    };

    fetchHouses("/api/houses/get?offer=true&limit=4", setOfferHouses);
    fetchHouses("/api/houses/get?type=rent&limit=4", setRentHouses);
    fetchHouses("/api/houses/get?type=sale&limit=4", setSaleHouses);
  }, []);

  const renderSection = (title, houses, query) => {
    if (!houses || houses.length === 0) return null;
    return (
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-6">
          {houses.map((house) => (
            <HouseItems house={house} key={house._id} />
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link to={`/search?${query}`} className="text-sm text-blue-800 hover:underline">
            Ver mais
          </Link>
        </div>
      </section>
    );
  };

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto text-center">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Encontre a sua <span className="text-slate-500">casa perfeita</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Temos uma vasta gama de casas para arrendamento, venda e ofertas especiais em todo Moçambique.
        </p>
        <Link to="/search" className="text-sm sm:text-base text-blue-800 font-bold hover:underline">
          Vamos começar...
        </Link>
      </div>

      {/* Swiper */}
      {offerHouses.length > 0 && (
        <Swiper navigation>
          {offerHouses.map((house) => (
            <SwiperSlide key={house._id}>
              {house.imageUrls && house.imageUrls.length > 0 ? (
                <div
                  style={{
                    background: `url(${house.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                />
              ) : (
                <div className="h-[500px] bg-gray-200 flex items-center justify-center text-gray-500">
                  Sem imagem
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Sections */}
      <div className="max-w-6xl mx-auto p-3 grid gap-10 my-10">
        {renderSection("Ofertas Recentes", offerHouses, "offer=true")}
        {renderSection("Arrendamento", rentHouses, "type=rent")}
        {renderSection("Venda", saleHouses, "type=sale")}
      </div>
    </div>
  );
}
