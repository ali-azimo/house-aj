import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaSpinner,
  FaExclamationTriangle,
  FaBed,
  FaBath,
  FaUtensils,
  FaParking,
  FaDollarSign,
  FaTag
} from 'react-icons/fa';

export default function ShowItems() {
  const { currentUser } = useSelector((state) => state.user);
  const [showError, setShowError] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setShowError(false);
      setIsLoading(true);
      const res = await fetch("/api/houses" + currentUser._id, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao carregar propriedades');
      
      // Garantir que imageUrls seja um array
      const itemsWithProcessedImages = data.map(item => ({
        ...item,
        imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : 
                  typeof item.imageUrls === 'string' ? JSON.parse(item.imageUrls) : []
      }));
      
      setUserItems(itemsWithProcessedImages);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (currentUser?._id) fetchItems();
  }, [currentUser?._id, fetchItems]);

  const handleDelete = async (itemId) => {
    const confirm = window.confirm('Tem certeza que deseja apagar esta propriedade?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/houses/${itemId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao apagar propriedade');
      
      setUserItems((prev) => prev.filter((item) => item._id !== itemId));
      setSuccessMessage('Propriedade apagada com sucesso.');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao apagar:', error.message);
      setShowError(error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getTypeLabel = (type) => {
    return type === 'sale' ? 'Venda' : 'Aluguel';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#101828] to-[#1e293b] rounded-2xl mb-4 shadow-lg">
          <FaHome className="text-3xl text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#101828] mb-3">Minhas Propriedades</h1>
        <p className="text-gray-600 text-lg">Gerencie todas as suas propriedades cadastradas</p>
      </div>

      {/* Mensagens de status */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 text-center">
          {successMessage}
        </div>
      )}

      {showError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 text-center flex items-center justify-center gap-2">
          <FaExclamationTriangle />
          Ocorreu um erro ao carregar as propriedades.
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-[#101828] mb-4" />
            <p className="text-gray-600 text-lg">Carregando suas propriedades...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Empty state */}
          {userItems.length === 0 && !showError && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
              <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Nenhuma propriedade encontrada</h3>
              <p className="text-gray-500 mb-6">Comece criando sua primeira propriedade!</p>
              <Link
                to="/create-house"
                className="inline-flex items-center gap-2 bg-[#101828] hover:bg-[#0a1424] text-white font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                <FaPlus />
                Criar Primeira Propriedade
              </Link>
            </div>
          )}

          {/* Grid de propriedades */}
          {userItems.length > 0 && (
            <>
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#101828]">
                      {userItems.length} propriedade{userItems.length !== 1 ? 's' : ''}
                    </span>
                    <span className="bg-[#101828] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Total
                    </span>
                  </div>
                  <Link
                    to="/create-house"
                    className="inline-flex items-center gap-2 bg-[#101828] hover:bg-[#0a1424] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    <FaPlus />
                    Nova Propriedade
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                  >
                    {/* Imagem */}
                    <div className="relative">
                      <img
                        src={item.imageUrls[0] || '/placeholder-house.jpg'}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'sale' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      {item.offer && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FaTag className="text-xs" />
                            Desconto
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5">
                      {/* Título e preço */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-[#101828] line-clamp-2 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#101828]">
                            {item.offer && item.discountPrice 
                              ? formatPrice(item.discountPrice)
                              : formatPrice(item.regularPrice)
                            }
                          </span>
                          {item.offer && item.discountPrice && (
                            <span className="line-through text-gray-400 text-sm">
                              {formatPrice(item.regularPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Características */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaBed className="text-purple-500" />
                          <span>{item.bedroom} quarto{item.bedroom !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaBath className="text-blue-400" />
                          <span>{item.bathroom} banheiro{item.bathroom !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaUtensils className="text-orange-500" />
                          <span>{item.kitchen || 1} cozinha{item.kitchen !== 1 ? 's' : ''}</span>
                        </div>
                        {item.parking && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaParking className="text-green-500" />
                            <span>Estacionamento</span>
                          </div>
                        )}
                      </div>

                      {/* Data e ações */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt || item.timestamp).toLocaleDateString('pt-BR')}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/house/${item._id}`}
                            className="p-2 text-gray-600 hover:text-[#101828] transition-colors"
                            title="Visualizar"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/update-house/${item._id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            title="Apagar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}