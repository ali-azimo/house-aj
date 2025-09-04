import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import MapMoz from "../components/MapMoz";
import { formatDistanceToNow } from "date-fns";
import pt from "date-fns/locale/pt";

export default function ShowItem() {
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

  // Função para apagar imóvel
  const handleDelete = async (id, category) => {
    if (!window.confirm("Tens certeza que deseja apagar este imóvel?")) return;

    try {
      const res = await fetch(`/api/houses/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao apagar imóvel");

      // Atualiza a lista removendo o item apagado
      if (category === "offer") {
        setOfferHouses((prev) => prev.filter((h) => (h.id || h._id) !== id));
      } else if (category === "rent") {
        setRentHouses((prev) => prev.filter((h) => (h.id || h._id) !== id));
      } else if (category === "sale") {
        setSaleHouses((prev) => prev.filter((h) => (h.id || h._id) !== id));
      }

      alert("Imóvel apagado com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar imóvel:", error);
      alert("Erro ao apagar imóvel");
    }
  };

  return (
    <div>
      {/* Secções */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-12 my-10">
        <Section
          title="Ofertas Recentes"
          link="/search?offer=true"
          linkText="Ver mais ofertas"
          items={offerHouses}
          category="offer"
          onDelete={handleDelete}
        />

        <Section
          title="Casas para Arrendamento"
          link="/search?type=rent"
          linkText="Ver mais arrendamentos"
          items={rentHouses}
          category="rent"
          onDelete={handleDelete}
        />

        <Section
          title="Casas para Venda"
          link="/search?type=sale"
          linkText="Ver mais vendas"
          items={saleHouses}
          category="sale"
          onDelete={handleDelete}
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
function Section({ title, link, linkText, items, category, onDelete }) {
  return (
    <div>
      <div className="my-3 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
        <Link to={link} className="text-sm text-blue-800 hover:underline">
          {linkText}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((house) => (
            <div
              key={house.id || house._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col"
            >
              {/* Imagem com preço sobreposto */}
              <div className="relative">
                <Link to={`/house/${house.id || house._id}`}>
                  <img
                    src={house.imageUrls?.[0] || "/placeholder.jpg"}
                    alt={house.name}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                </Link>
                {/* Badge do preço */}
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow">
                  {house.offer && house.discountPrice
                    ? `${house.discountPrice} MT`
                    : `${house.regularPrice} MT`}
                  {house.type === "rent" && " / mês"}
                </span>
              </div>

              {/* Informações */}
              <div className="p-3 flex flex-col gap-2">
                <h3 className="font-semibold text-lg text-slate-700">
                  {house.name}
                </h3>
                <p className="text-gray-600">
                  {house.address || "Sem localização"}
                </p>
                <p className="text-slate-600">
                  Tipo: {house.type === "sale" ? "Venda" : "Arrendamento"}
                </p>

                {/* Data de publicação */}
                {house.createdAt && (
                  <p className="text-xs text-gray-500">
                    Publicado{" "}
                    {formatDistanceToNow(new Date(house.createdAt), {
                      locale: pt,
                      addSuffix: true,
                    })}
                  </p>
                )}

                {/* Botões */}
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/dashboard/update-house/${house.id || house._id}`}
                    className="flex-1 px-3 py-1 bg-yellow-500 text-white text-center text-sm rounded hover:bg-yellow-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => onDelete(house.id || house._id, category)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Apagar
                  </button>
                </div>
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

