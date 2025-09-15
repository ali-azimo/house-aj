import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import HouseItems from "../components/HouseItems";
import MapMoz from "../components/MapMoz";
import LikeButton from "../components/LikeButton"; // Importa LikeButton

export default function Arrendar() {
  const [offerHouses, setOfferHouses] = useState([]);
  const [saleHouses, setSaleHouses] = useState([]);
  const [rentHouses, setRentHouses] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        // Rendas
        const rentRes = await fetch("/api/houses/get?type=rent&limit=6");
        const rentData = await rentRes.json();
        setRentHouses(rentData.data || []);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
      }
    };

    fetchHouses();
  }, []);

  return (
    <div>
      {/* Swiper de Ofertas */}
      {rentHouses.length > 0 && (
        <Swiper navigation>
          {rentHouses.map((house) => (
            <SwiperSlide key={house.id || house._id}>
              <div
                style={{
                  background: house.imageUrls?.length
                    ? `url(${house.imageUrls[0]}) center no-repeat`
                    : "#ccc",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  height: "500px",
                }}
                className="rounded-lg shadow-md relative"
              >
                {/* Promoção ou não */}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-md text-sm font-semibold">
                  {house.rent ? (
                    <span className="text-green-600">Promoção disponível</span>
                  ) : (
                    <span className="text-red-600">Sem promoção</span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Encontre a sua próxima <span className="text-blue-600">casa</span>{" "}
          <span className="text-slate-500">perfeita</span>
        </h1>
        <p className="text-gray-500 text-sm">
          A BGS é o melhor lugar para encontrar a sua próxima casa ou
          apartamento. Temos uma vasta gama de imóveis à sua escolha.
        </p>
        <Link
          to="/search"
          className="text-sm text-blue-800 font-bold hover:underline"
        >
          Começar pesquisa ...
        </Link>
      </div>

      {/* Secções */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-12 my-10">

        <Section
          title="Casas para Arrendamento"
          link="/search?type=rent"
          linkText="Ver mais arrendamentos"
          items={rentHouses}
        />

        
      </div>

      {/* Mapa no final da página */}
      <div className="max-w-6xl mx-auto p-3 my-10">
        <h2 className="text-2xl font-semibold text-slate-600 mb-6">
          Localização dos Nossos Imóveis
        </h2>
        <MapMoz />
      </div>
    </div>
  );
}

/* Sub-componente de Seção */
function Section({ title, link, linkText, items }) {
  return (
    <div>
      <div className="my-3 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
        <Link to={link} className="text-sm text-blue-800 hover:underline">
          {linkText}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((house) => (
            <div key={house.id || house._id} className="relative">
              <HouseItems house={house} />

              {/* Promoção e LikeButton no topo */}
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow flex flex-col items-end gap-1">
                {house.offer ? (
                  <span className="text-green-600 text-xs font-semibold">
                    Promoção
                  </span>
                ) : (
                  <span className="text-red-600 text-xs font-semibold">
                    Sem promoção
                  </span>
                )}

                {/* LikeButton */}
                <LikeButton houseId={house.id || house._id} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">Nenhum imóvel encontrado.</p>
        )}
      </div>
    </div>
  );
}
