import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaBed,
  FaBath,
  FaCar,
  FaCouch,
  FaUtensils
} from "react-icons/fa";

export default function HouseItems({ house }) {
  const [favorite, setFavorite] = useState(false);

  const toggleFavorite = () => setFavorite((prev) => !prev);

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 0
    }).format(price);

  const renderStars = (rating = 4) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-gray-100 flex flex-col w-full sm:w-[48%] lg:w-[23%]">
      {/* Imagem */}
      <div className="relative">
        {house.imageUrls?.[0] ? (
          <img
            src={house.imageUrls[0]}
            alt={house.name}
            className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}

        {/* Botão Favorito */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
        >
          {favorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
        </button>

        {/* Preço */}
        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
          {formatPrice(house.regularPrice)}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Avaliação */}
        <div className="flex items-center mb-1">
          <div className="flex">{renderStars()}</div>
          <span className="text-xs text-gray-500 ml-1">(4)</span>
        </div>

        <h2 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1">
          {house.name}
        </h2>

        <div className="flex items-center text-xs text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-1 text-[#101828]" />
          <span className="line-clamp-1">{house.address}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{house.descricao}</p>

        {/* Características */}
        <div className="flex justify-between text-gray-700 text-xs border-t border-gray-100 pt-3">
          <Feature icon={<FaBed />} label="Camas" value={house.bedroom} />
          <Feature icon={<FaBath />} label="Banhos" value={house.bathroom} />
          <Feature icon={<FaUtensils />} label="Cozinha" value={house.kitchen} />
          <Feature icon={<FaCar />} label="Parqueamento" value={house.parking ? "Sim" : "Não"} />
          <Feature icon={<FaCouch />} label="Mobília" value={house.furnished ? "Sim" : "Não"} />
        </div>
      </div>

      {/* Botão Ver Detalhes */}
      <div className="px-4 pb-4 mt-auto">
        <Link
          to={`/houses/${house._id}`}
          className="w-full block text-center bg-[#101828] hover:bg-[#0a1424] text-white py-2 rounded-xl font-medium transition-colors text-sm"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

// Componente pequeno para características
const Feature = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <span className="font-bold">{value}</span>
    <div className="flex items-center gap-1">
      {icon}
      <span>{label}</span>
    </div>
  </div>
);
