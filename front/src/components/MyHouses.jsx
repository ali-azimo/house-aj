import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaHome, 
  FaTag,
  FaChartBar,
  FaMoneyBillWave,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MyHouses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  // Dados para gráficos
  const [chartData, setChartData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  // Cores para os gráficos
  const COLORS = ['#101828', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchMyHouses = async () => {
      try {
        setLoading(true);
       const userId = currentUser?.id || currentUser?.user?.id || currentUser?._id;

        const res = await fetch(`/api/houses/user/${userId}`, {
        method: 'GET',
        credentials: 'include'
        });
        const data = await res.json();
         console.log("currentUser Redux:", currentUser);
        if (data.success) {
          setHouses(data.data || data.houses || []);
          prepareChartData(data.data || data.houses || []);
        } else {
          setError(data.message || 'Erro ao carregar imóveis');
        }
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        setError('Erro de conexão ao carregar imóveis');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMyHouses();
    }
  }, [currentUser]);

  const prepareChartData = (housesData) => {
    // Preparar dados para gráfico de preços
    const priceData = housesData.map(house => ({
      name: house.name.length > 15 ? house.name.substring(0, 15) + '...' : house.name,
      preco: house.offer ? house.discountPrice : house.regularPrice,
      tipo: house.type === 'rent' ? 'Aluguel' : 'Venda'
    }));
    
    setChartData(priceData);

    // Preparar dados para gráfico de tipos
    const typeCount = {
      'Venda': housesData.filter(house => house.type === 'sale').length,
      'Aluguel': housesData.filter(house => house.type === 'rent').length,
      'Com Oferta': housesData.filter(house => house.offer).length
    };

    const typeChartData = Object.keys(typeCount).map((key, index) => ({
      name: key,
      value: typeCount[key],
      color: COLORS[index % COLORS.length]
    }));

    setTypeData(typeChartData);
  };

  const handleDelete = async (houseId) => {
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      const res = await fetch(`/api/houses/delete/${houseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setHouses(houses.filter(house => house._id !== houseId));
        prepareChartData(houses.filter(house => house._id !== houseId));
      } else {
        setError(data.message || 'Erro ao excluir imóvel');
      }
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      setError('Erro de conexão ao excluir imóvel');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#101828]"></div>
        <p className="ml-4 text-gray-600">Carregando seus imóveis...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101828] mb-2">Meus Imóveis</h1>
        <p className="text-gray-600">Gerencie e visualize os imóveis que você cadastrou</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {/* Estatísticas e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#101828] mb-4 flex items-center gap-2">
            <FaChartBar className="text-[#101828]" />
            Distribuição por Tipo
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#101828] mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-[#101828]" />
            Preços dos Imóveis
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} MT`, 'Preço']} />
                <Legend />
                <Bar dataKey="preco" fill="#101828" name="Preço (MT)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Imóveis */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#101828]">Seus Imóveis Cadastrados</h2>
          <Link
            to="/dashboard/cad_house"
            className="bg-[#101828] text-white px-4 py-2 rounded-lg hover:bg-[#0a1424] transition-colors"
          >
            Cadastrar Novo Imóvel
          </Link>
        </div>

        {houses.length === 0 ? (
          <div className="text-center py-12">
            <FaHome className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Você ainda não cadastrou nenhum imóvel</p>
            <Link
              to="/dashboard/cad_house"
              className="inline-block mt-4 text-[#101828] hover:underline"
            >
              Cadastre seu primeiro imóvel
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Imóvel</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Localização</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Preço</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => (
                  <tr key={house._id || house.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {house.imageUrls && house.imageUrls.length > 0 ? (
                          <img
                            src={house.imageUrls[0]}
                            alt={house.name}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center mr-3">
                            <FaHome className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#101828]">{house.name}</p>
                          <p className="text-sm text-gray-500">
                            {house.bedroom} quarto(s), {house.bathroom} banheiro(s)
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-[#101828]" />
                        {house.address ? (
                          <span>{house.address.split(',')[0]}</span>
                        ) : (
                          <span className="text-gray-400">Sem endereço</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${house.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {house.type === 'rent' ? 'Aluguel' : 'Venda'}
                      </span>
                      {house.offer && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FaTag className="mr-1" /> Oferta
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#101828]">
                        {house.offer && house.discountPrice ? house.discountPrice : house.regularPrice} MT
                      </p>
                      {house.offer && house.discountPrice && (
                        <p className="text-sm text-gray-500 line-through">{house.regularPrice} MT</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/house/${house._id || house.id}`}
                          className="p-2 text-[#101828] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/dashboard/update-house/${house._id || house.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(house._id || house.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}