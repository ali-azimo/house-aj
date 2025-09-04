import React, { useEffect, useState } from "react";
import { FaHome, FaChartPie, FaChartLine, FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Stats() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch("/api/houses/get");
        const data = await res.json();
        if (data.success) {
          setHouses(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  if (loading) return <p>Carregando estatísticas...</p>;

  // Estatísticas básicas
  const total = houses.length;
  const porTipo = houses.reduce((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {});

  const porOferta = {
    comOferta: houses.filter((h) => h.offer === 1).length,
    semOferta: houses.filter((h) => h.offer === 0).length,
  };

  const dataTipos = Object.entries(porTipo).map(([key, value]) => ({
    name: key,
    value,
  }));

  const dataOferta = [
    { name: "Com Oferta", value: porOferta.comOferta },
    { name: "Sem Oferta", value: porOferta.semOferta },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FaHome /> Estatísticas de Imóveis
      </h1>

      <p className="text-gray-600">Total de imóveis cadastrados: <strong>{total}</strong></p>

      {/* Gráfico de barras - Tipos */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar /> Imóveis por Tipo
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataTipos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pizza - Ofertas */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartPie /> Imóveis com Oferta
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataOferta}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {dataOferta.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
