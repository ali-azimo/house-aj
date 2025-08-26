import React, { useState, useEffect } from "react";
import { FaBed, FaBath, FaCar, FaCouch, FaSearch, FaFilter, FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    tipo: "todos",
    quartos: "todos",
    precoMin: "",
    precoMax: "",
    ordenacao: "recentes"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imagens para o slider de fundo
  const sliderImages = [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
    "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
    "https://images.pexels.com/photos/236067/pexels-photo-236067.jpeg"
  ];

  // Efeito para rotacionar automaticamente o slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const imoveis = [
    {
      id: 1,
      titulo: "Apartamento Moderno no Centro",
      descricao: "Apartamento T2 espaçoso, perto de escolas e serviços.",
      imagem: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
      camas: 2,
      banheiros: 1,
      garagem: 1,
      sala: 1,
      preco: 2500000,
      localizacao: "Maputo, Centro",
      tipo: "apartamento",
      destacado: true,
      rating: 4.5
    },
    {
      id: 2,
      titulo: "Casa Familiar com Jardim",
      descricao: "Excelente casa com quintal amplo e área de lazer.",
      imagem: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      camas: 3,
      banheiros: 2,
      garagem: 2,
      sala: 2,
      preco: 4500000,
      localizacao: "Matola, Zona Sul",
      tipo: "casa",
      rating: 4.2
    },
    {
      id: 3,
      titulo: "Apartamento de Luxo Vista Mar",
      descricao: "Vista panorâmica, condomínio com piscina e segurança.",
      imagem: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      camas: 4,
      banheiros: 3,
      garagem: 2,
      sala: 2,
      preco: 7800000,
      localizacao: "Costa do Sol",
      tipo: "apartamento",
      destacado: true,
      rating: 4.8
    },
    {
      id: 4,
      titulo: "Moradia T3 com Piscina",
      descricao: "Moradia moderna com piscina e jardim privativo.",
      imagem: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg",
      camas: 3,
      banheiros: 2,
      garagem: 1,
      sala: 1,
      preco: 5500000,
      localizacao: "Maputo, Sommerschield",
      tipo: "moradia",
      rating: 4.3
    },
    {
      id: 5,
      titulo: "Loft Industrial",
      descricao: "Loft amplo com estilo industrial e localização privilegiada.",
      imagem: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      camas: 1,
      banheiros: 1,
      garagem: 0,
      sala: 1,
      preco: 1800000,
      localizacao: "Maputo, Baixa",
      tipo: "loft",
      rating: 4.0
    },
    {
      id: 6,
      titulo: "Vivenda de Luxo",
      descricao: "Vivenda exclusiva com acabamentos de alta qualidade.",
      imagem: "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg",
      camas: 5,
      banheiros: 4,
      garagem: 3,
      sala: 2,
      preco: 12000000,
      localizacao: "Maputo, Polana",
      tipo: "vivenda",
      destacado: true,
      rating: 4.9
    },
    {
      id: 7,
      titulo: "Apartamento Compacto",
      descricao: "Apartamento T1 ideal para solteiros ou casais.",
      imagem: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      camas: 1,
      banheiros: 1,
      garagem: 0,
      sala: 1,
      preco: 1500000,
      localizacao: "Maputo, Alto Maé",
      tipo: "apartamento",
      rating: 3.9
    },
    {
      id: 8,
      titulo: "Casa com Piscina",
      descricao: "Casa moderna com piscina e área de churrasco.",
      imagem: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      camas: 4,
      banheiros: 3,
      garagem: 2,
      sala: 2,
      preco: 6800000,
      localizacao: "Matola, Machava",
      tipo: "casa",
      rating: 4.6
    },
    {
      id: 9,
      titulo: "Duplex de Luxo",
      descricao: "Duplex com acabamentos premium e vista deslumbrante.",
      imagem: "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg",
      camas: 3,
      banheiros: 2,
      garagem: 2,
      sala: 1,
      preco: 5200000,
      localizacao: "Maputo, Coop",
      tipo: "apartamento",
      rating: 4.7
    },
    {
      id: 10,
      titulo: "Casa Geminada",
      descricao: "Casa geminada em condomínio fechado com segurança 24h.",
      imagem: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      camas: 3,
      banheiros: 2,
      garagem: 1,
      sala: 1,
      preco: 4200000,
      localizacao: "Maputo, Zimpeto",
      tipo: "casa",
      rating: 4.1
    },
    {
      id: 11,
      titulo: "Studio Mobiliado",
      descricao: "Studio completamente mobiliado, pronto para morar.",
      imagem: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
      camas: 1,
      banheiros: 1,
      garagem: 0,
      sala: 0,
      preco: 1200000,
      localizacao: "Maputo, Central",
      tipo: "studio",
      rating: 4.0
    },
    {
      id: 12,
      titulo: "Mansão com Vista para o Mar",
      descricao: "Mansão exclusiva com vista panorâmica para o oceano.",
      imagem: "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg",
      camas: 6,
      banheiros: 5,
      garagem: 4,
      sala: 3,
      preco: 18500000,
      localizacao: "Ponta do Ouro",
      tipo: "mansao",
      destacado: true,
      rating: 5.0
    }
  ];

  // Filtrar imóveis com base nos critérios de pesquisa
  const filteredImoveis = imoveis.filter(imovel => {
    const matchesSearch = imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          imovel.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          imovel.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filters.tipo === "todos" || imovel.tipo === filters.tipo;
    
    const matchesQuartos = filters.quartos === "todos" || imovel.camas >= parseInt(filters.quartos);
    
    const matchesPrecoMin = !filters.precoMin || imovel.preco >= parseInt(filters.precoMin);
    
    const matchesPrecoMax = !filters.precoMax || imovel.preco <= parseInt(filters.precoMax);
    
    return matchesSearch && matchesTipo && matchesQuartos && matchesPrecoMin && matchesPrecoMax;
  });

  // Ordenar imóveis
  const sortedImoveis = [...filteredImoveis].sort((a, b) => {
    switch(filters.ordenacao) {
      case "preco-crescente":
        return a.preco - b.preco;
      case "preco-decrescente":
        return b.preco - a.preco;
      case "rating":
        return b.rating - a.rating;
      case "recentes":
      default:
        return b.id - a.id;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 0 }).format(price);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section com Slider de Fundo */}
      <div className="relative h-96 md:h-screen max-h-[700px] overflow-hidden">
        {/* Slider de Imagens */}
        <div className="relative h-full w-full">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Imóvel ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Conteúdo sobreposto ao slider */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              Encontre o Imóvel dos Seus Sonhos
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
              Descubra as melhores propriedades em Moçambique com a ImoElite
            </p>
            
            <div className="bg-white bg-opacity-90 rounded-2xl p-2 shadow-lg max-w-2xl mx-auto animate-fade-in-delay-2">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 flex items-center px-3">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Pesquisar por localização, tipo de imóvel, etc..."
                    className="w-full py-3 outline-none text-gray-800 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  className="bg-[#101828] hover:bg-[#0a1424] text-white px-6 py-3 rounded-lg flex items-center mt-3 md:mt-0 md:ml-2 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="mr-2" />
                  Filtros
                </button>
              </div>
              
              {/* Filtros Avançados */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={filters.tipo}
                      onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                    >
                      <option value="todos">Todos</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                      <option value="moradia">Moradia</option>
                      <option value="vivenda">Vivenda</option>
                      <option value="loft">Loft</option>
                      <option value="studio">Studio</option>
                      <option value="mansao">Mansão</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mín. de Quartos</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={filters.quartos}
                      onChange={(e) => setFilters({...filters, quartos: e.target.value})}
                    >
                      <option value="todos">Todos</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Mín (MT)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      placeholder="Ex: 1000000"
                      value={filters.precoMin}
                      onChange={(e) => setFilters({...filters, precoMin: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Máx (MT)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      placeholder="Ex: 5000000"
                      value={filters.precoMax}
                      onChange={(e) => setFilters({...filters, precoMax: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={filters.ordenacao}
                      onChange={(e) => setFilters({...filters, ordenacao: e.target.value})}
                    >
                      <option value="recentes">Mais Recentes</option>
                      <option value="preco-crescente">Preço: Menor-Maior</option>
                      <option value="preco-decrescente">Preço: Maior-Menor</option>
                      <option value="rating">Melhor Avaliados</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controles do Slider */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
          aria-label="Slide anterior"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
          aria-label="Próximo slide"
        >
          <FaChevronRight />
        </button>

        {/* Indicadores do Slider */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Resultados da Pesquisa */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            {filteredImoveis.length} Imóveis Encontrados
          </h2>
          <div className="text-sm text-gray-600">
            Ordenado por: {filters.ordenacao === "recentes" ? "Mais Recentes" : 
                          filters.ordenacao === "preco-crescente" ? "Preço: Menor-Maior" :
                          filters.ordenacao === "preco-decrescente" ? "Preço: Maior-Menor" : "Melhor Avaliados"}
          </div>
        </div>

        {/* Lista de Imóveis com Grid de 4 Colunas */}
        {sortedImoveis.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termos de pesquisa</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedImoveis.map((imovel) => (
              <div
                key={imovel.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={imovel.imagem}
                    alt={imovel.titulo}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {imovel.destacado && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Destaque
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => toggleFavorite(imovel.id)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Adicionar aos favoritos"
                    >
                      {favorites.includes(imovel.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    {formatPrice(imovel.preco)}
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <div className="flex items-center mb-1">
                    <div className="flex">
                      {renderStars(imovel.rating)}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({imovel.rating})</span>
                  </div>
                  
                  <h2 className="text-md font-semibold text-gray-800 mb-1 hover:text-[#101828] transition-colors cursor-pointer line-clamp-1">
                    {imovel.titulo}
                  </h2>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1 text-[#101828]" />
                    <span className="line-clamp-1">{imovel.localizacao}</span>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-2">
                    {imovel.descricao}
                  </p>
                  
                  <div className="grid grid-cols-4 gap-2 text-gray-700 text-xs border-t border-gray-100 pt-3">
                    <div className="flex flex-col items-center" title="Quartos">
                      <FaBed className="text-[#101828] mb-1" /> 
                      <span className="font-medium">{imovel.camas}</span>
                    </div>
                    <div className="flex flex-col items-center" title="Banheiros">
                      <FaBath className="text-[#101828] mb-1" /> 
                      <span className="font-medium">{imovel.banheiros}</span>
                    </div>
                    <div className="flex flex-col items-center" title="Garagem">
                      <FaCar className="text-[#101828] mb-1" /> 
                      <span className="font-medium">{imovel.garagem}</span>
                    </div>
                    <div className="flex flex-col items-center" title="Salas">
                      <FaCouch className="text-[#101828] mb-1" /> 
                      <span className="font-medium">{imovel.sala}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <button className="w-full bg-[#101828] hover:bg-[#0a1424] text-white py-2 rounded-xl font-medium transition-colors text-sm">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {sortedImoveis.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-[#101828] bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-[#101828] border border-[#101828] rounded-lg">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-[#101828] bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 text-sm font-medium text-[#101828] bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                3
              </button>
              <span className="px-2 py-2 text-sm font-medium text-gray-500">...</span>
              <button className="px-4 py-2 text-sm font-medium text-[#101828] bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                5
              </button>
              <button className="px-4 py-2 text-sm font-medium text-[#101828] bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Próximo
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Estilos para animações */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}