// pages/Stats.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Stats() {
  const [userStats, setUserStats] = useState({
    customers: 0,
    users: 0
  });
  const [houseStats, setHouseStats] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de dados - substitua pela sua API real
    const fetchStats = async () => {
      try {
        // Em um cenário real, você faria requisições à sua API
        // const userResponse = await fetch('/api/users/stats');
        // const houseResponse = await fetch('/api/houses/stats');
        
        // Dados simulados
        setTimeout(() => {
          setUserStats({
            customers: 42,
            users: 78
          });
          setHouseStats(156);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dados para o gráfico de barras (usuários)
  const userBarData = {
    labels: ['Clientes', 'Usuários'],
    datasets: [
      {
        label: 'Quantidade de Usuários',
        data: [userStats.customers, userStats.users],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de rosca (casas)
  const houseDoughnutData = {
    labels: ['Casas Cadastradas'],
    datasets: [
      {
        label: 'Quantidade',
        data: [houseStats],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estatísticas de Usuários',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estatísticas de Imóveis',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Estatísticas do Sistema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Resumo</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-blue-800 font-medium">Total de Clientes</h3>
              <p className="text-2xl font-bold text-blue-600">{userStats.customers}</p>
            </div>
            <div className="bg-teal-50 p-4 rounded">
              <h3 className="text-teal-800 font-medium">Total de Usuários</h3>
              <p className="text-2xl font-bold text-teal-600">{userStats.users}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded">
              <h3 className="text-pink-800 font-medium">Total de Casas</h3>
              <p className="text-2xl font-bold text-pink-600">{houseStats}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Imóveis</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={houseDoughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distribuição de Usuários</h2>
        <div className="h-96">
          <Bar data={userBarData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}