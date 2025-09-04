import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import { FaMapMarkerAlt, FaShare, FaBed, FaBath, FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { IoCarSport } from 'react-icons/io5';
import { GiKidSlide } from 'react-icons/gi';
import SimilarItems from '../components/SimilarItems';
import MapMoz from '../components/MapMoz';

export default function HouseDetail({ type = 'houses' }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

 useEffect(() => {
  const fetchItem = async () => {
    try {
      setLoading(true);
      console.log("Buscando:", `/api/${type}/get/${id}`);
      const res = await fetch(`/api/${type}/get/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erro na resposta da API');
      const raw = await res.json();
      console.log("Resposta da API:", raw);

      // Garante que pega os dados certos (diretos ou dentro de .data)
      const data = raw.data ? raw.data : raw;

      if (!data || data.success === false) {
        setError(true);
        setItem(null);
      } else {
        setItem({
          ...data,
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
        });
        setError(false);
      }
    } catch (err) {
      console.error('Erro ao buscar imóvel:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchItem();
}, [id, type]);

  if (loading)
    return (
      <div className="text-center my-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F2E54]"></div>
        <p className="mt-4 text-lg text-gray-600">Carregando detalhes do imóvel...</p>
      </div>
    );

  if (error || !item)
    return (
      <div className="text-center my-20">
        <p className="text-2xl text-red-600">Ocorreu um erro ao carregar este imóvel</p>
        <p className="text-gray-600 mt-2">Por favor, tente novamente mais tarde</p>
      </div>
    );

  const images = item.imageUrls.length ? item.imageUrls : ['/placeholder.jpg'];

  return (
    <main className="bg-gray-50">
      {/* Carrossel */}
      <div className="relative">
        <Swiper navigation pagination={{ clickable: true }} loop modules={[Navigation, Pagination]}>
          {images.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-[400px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botão Copiar URL */}
        <div className="fixed top-[13%] right-[3%] z-10">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <FaShare className="text-[#1F2E54]" />
          </button>
          {copied && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-md shadow-md text-sm">
              Link copiado!
            </div>
          )}
        </div>
      </div>

      {/* Detalhes */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2E54]">{item.name || 'Imóvel'}</h1>
              {item.address && (
                <div className="flex items-center mt-2 text-gray-600">
                  <FaMapMarkerAlt className="text-[#1F2E54] mr-2" /> {item.address}
                </div>
              )}

              {/* Preço */}
              <div className="mt-4">
                <p className="text-2xl font-bold text-[#1F2E54]">
                  {item.offer && item.discountPrice ? item.discountPrice : item.regularPrice} MT
                  {item.type === 'rent' && ' / mês'}
                </p>
                {item.offer && item.discountPrice && (
                  <p className="text-lg text-gray-500 line-through">{item.regularPrice} MT</p>
                )}
              </div>

              <ul className="text-[#1F2E54] font-semibold text-sm gap-4 sm:gap-6 flex items-center flex-wrap my-4">
                {item.bedroom > 0 && (
                  <li className="flex items-center gap-1">
                    <FaBed /> {item.bedroom} {item.bedroom > 1 ? 'Quartos' : 'Quarto'}
                  </li>
                )}
                {item.bathroom > 0 && (
                  <li className="flex items-center gap-1">
                    <FaBath /> {item.bathroom} {item.bathroom > 1 ? 'Banheiros' : 'Banheiro'}
                  </li>
                )}
                {item.kitchen > 0 && (
                  <li className="flex items-center gap-1">
                    <GiKidSlide /> {item.kitchen} {item.kitchen > 1 ? 'Cozinhas' : 'Cozinha'}
                  </li>
                )}
                <li className="flex items-center gap-1">
                  <IoCarSport /> {item.parking ? 'Com estacionamento' : 'Sem estacionamento'}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Descrição e Contato */}
            <div className="md:flex-[0_0_60%]">
              <h3 className="text-xl font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{item.descricao || 'Sem descrição disponível.'}</p>

              <div className="flex flex-col gap-3 mt-4">
                <a href="https://wa.me/258845826662" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:underline">
                  <FaWhatsapp /> WhatsApp: +258 845826662 / 875826662
                </a>
                <a href="tel:+258845826662" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                  <FaPhone /> Ligar: +258 845826662
                </a>
                <a href="mailto:bgs.soluction@gmail.com" className="inline-flex items-center gap-2 text-red-600 hover:underline">
                  <FaEnvelope /> Email: bgs.soluction@gmail.com
                </a>
              </div>

              {item.address && (
                <div className="mt-6">
                  <MapMoz address={item.address} />
                </div>
              )}
            </div>

            {/* Informações adicionais */}
            <div className="md:flex-[0_0_40%] md:border-l md:border-gray-300 md:pl-6">
              <h3 className="text-xl font-semibold mb-4">Detalhes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{item.type === 'rent' ? 'Arrendamento' : 'Venda'}</span>
                </div>
                {item.offer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Oferta:</span>
                    <span className="font-medium text-green-600">Disponível</span>
                  </div>
                )}
                {item.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publicado:</span>
                    <span className="font-medium">{new Date(item.created_at).toLocaleDateString('pt-MZ')}</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-4 mt-6">Itens Semelhantes</h3>
              <div className="overflow-x-auto">
                <SimilarItems type={type} id={item._id || item.id} currentItem={item} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}