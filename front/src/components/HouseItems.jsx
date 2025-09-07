import React from "react";
import { Link } from "react-router-dom";
import { 
  MdLocationOn, MdOutlineBathtub, MdBed, MdKitchen, MdChair, MdCheckCircle, MdCancel, MdDirectionsCar 
} from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import pt from "date-fns/locale/pt";
import LikeButton from "./LikeButton";

export default function HouseItems({ house }) {
  const houseId = house.id || house._id;
  const mainImage = house.imageUrls?.[0] || "/placeholder.jpg";

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      <Link to={`/house/${houseId}`}>
        <img src={mainImage} alt={house.name || "Imóvel"} className="h-[180px] w-full object-cover" />
        <div className="p-3 flex flex-col gap-2">
          <h3 className="font-semibold text-slate-700 truncate">{house.name || "Sem nome"}</h3>
          {house.descricao && <p className="text-gray-600 text-sm line-clamp-2">{house.descricao}</p>}
          {house.address && (
            <div className="flex items-center text-gray-600 text-sm">
              <MdLocationOn className="mr-1" /> {house.address}
            </div>
          )}
          <div className={`flex items-center text-sm font-medium ${house.available ? 'text-green-600' : 'text-red-600'}`}>
            {house.available ? <><MdCheckCircle className="mr-1" /> Disponível</> : <><MdCancel className="mr-1" /> Ocupada</>}
          </div>

          <div className="flex justify-between text-sm mt-2 text-gray-700 flex-wrap gap-2">
            {house.bedroom > 0 && <div className="flex items-center gap-1"><MdBed /> {house.bedroom} {house.bedroom > 1 ? "quartos" : "quarto"}</div>}
            {house.bathroom > 0 && <div className="flex items-center gap-1"><MdOutlineBathtub /> {house.bathroom} {house.bathroom > 1 ? "banheiros" : "banheiro"}</div>}
            {house.kitchen > 0 && <div className="flex items-center gap-1"><MdKitchen /> {house.kitchen} {house.kitchen > 1 ? "cozinhas" : "cozinha"}</div>}
            {house.livingroom > 0 && <div className="flex items-center gap-1"><MdChair /> {house.livingroom} {house.livingroom > 1 ? "salas" : "sala"}</div>}
            {house.parking && <div className="flex items-center gap-1"><MdDirectionsCar /> Estacionamento</div>}
          </div>

          <p className="font-bold mt-2 text-slate-700">{house.offer ? house.discountPrice : house.regularPrice} MT{house.type === "rent" && " / mês"}</p>

          <LikeButton houseId={houseId} />

          {house.created_at && <p className="text-xs text-gray-500 mt-2">Publicado {formatDistanceToNow(new Date(house.created_at), { locale: pt, addSuffix: true })}</p>}
        </div>
      </Link>
    </div>
  );
}
