import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import HouseItems from "../components/HouseItems";
import MapMoz from "../components/MapMoz";

export default function Home() {
  const [offerHouses, setOfferHouses] = useState([]);
  const [saleHouses, setSaleHouses] = useState([]);
  const [rentHouses, setRentHouses] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        // Ofertas
        const offerRes = await fetch("/api/houses/get?offer=true&limit=6");
        const offerData = await offerRes.json();
        setOfferHouses(offerData.data || []);

        // Rendas
        const rentRes = await fetch("/api/houses/get?type=rent&limit=6");
        const rentData = await rentRes.json();
        setRentHouses(rentData.data || []);

        // Vendas
        const saleRes = await fetch("/api/houses/get?type=sale&limit=6");
        const saleData = await saleRes.json();
        setSaleHouses(saleData.data || []);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
      }
    };

    fetchHouses();
  }, []);

  return (
    <div>
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

      {/* Swiper de Ofertas */}
      {offerHouses.length > 0 && (
        <Swiper navigation>
          {offerHouses.map((house) => (
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
                className="rounded-lg shadow-md"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Secções */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-12 my-10">
        <Section
          title="Ofertas Recentes"
          link="/search?offer=true"
          linkText="Ver mais ofertas"
          items={offerHouses}
        />

        <Section
          title="Casas para Arrendamento"
          link="/search?type=rent"
          linkText="Ver mais arrendamentos"
          items={rentHouses}
        />

        <Section
          title="Casas para Venda"
          link="/search?type=sale"
          linkText="Ver mais vendas"
          items={saleHouses}
        />
      </div>

      {/* Mapa no final da página */}
      <div className="max-w-6xl mx-auto p-3 my-10">
        <h2 className="text-2xl font-semibold text-slate-600 mb-6">Localização dos Nossos Imóveis</h2>
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
            <HouseItems house={house} key={house.id || house._id} />
          ))
        ) : (
          <p className="text-gray-400 italic">Nenhum imóvel encontrado.</p>
        )}
      </div>
    </div>
  );
}