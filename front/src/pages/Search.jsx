import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HouseItems from "../components/HouseItems.jsx";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    offer: false,
    available: true,
    sort: "created_at",
    order: "desc",
  });

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const LIMIT = 8;

  // Atualiza filtros a partir da URL e busca casas
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const newFilters = {
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true",
      offer: urlParams.get("offer") === "true",
      available: urlParams.get("available") !== "false",
      sort: urlParams.get("sort") || "created_at",
      order: urlParams.get("order") || "desc",
    };
    setFilters(newFilters);
    fetchHouses(newFilters, 0, true);
  }, [location.search]);

  const fetchHouses = async (filters, startIndex = 0, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        limit: LIMIT,
        startIndex,
      });
      const res = await fetch(`/api/houses/search?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        setHouses([]);
        setShowMore(false);
        return;
      }

      if (reset) setHouses(data.data || []);
      else setHouses((prev) => [...prev, ...(data.data || [])]);

      setShowMore(data.data && data.data.length === LIMIT);
    } catch (err) {
      console.error("Erro ao buscar casas:", err);
      setHouses([]);
      setShowMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setFilters((prev) => ({ ...prev, sort, order }));
    } else {
      setFilters((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(filters);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = () => fetchHouses(filters, houses.length);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-6xl m-auto">
      {/* Sidebar */}
      <div className="w-full md:w-[300px] bg-white rounded-xl shadow-md p-5 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="searchTerm" className="font-semibold text-slate-700">
              Termo de Pesquisa
            </label>
            <input
              id="searchTerm"
              type="text"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Pesquisar..."
              className="border p-2 rounded-xl w-full text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <span className="font-semibold text-slate-700">Tipo</span>
            {["all", "rent", "sale", "offer"].map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm mt-1">
                <input
                  type="checkbox"
                  id={t}
                  checked={
                    t === "all"
                      ? filters.type === "all"
                      : t === "offer"
                      ? filters.offer
                      : filters.type === t
                  }
                  onChange={() => {
                    if (t === "all") setFilters({ ...filters, type: "all", offer: false });
                    else if (t === "offer") setFilters({ ...filters, offer: !filters.offer, type: "all" });
                    else setFilters({ ...filters, type: t, offer: false });
                  }}
                  className="w-4 h-4 text-blue-600 rounded-md"
                />
                {t === "all" ? "Venda & Aluguer" : t === "rent" ? "Aluguer" : t === "sale" ? "Venda" : "Oferta"}
              </label>
            ))}
          </div>

          <div>
            <span className="font-semibold text-slate-700">Comodidades</span>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="parking"
                checked={filters.parking}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded-md"
              />
              Estacionamento
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="available"
                checked={filters.available}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded-md"
              />
              Disponível
            </label>
          </div>

          <div>
            <label htmlFor="sort_order" className="font-semibold text-slate-700">
              Ordenar por
            </label>
            <select
              id="sort_order"
              value={`${filters.sort}_${filters.order}`}
              onChange={handleChange}
              className="border p-2 rounded-xl w-full text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="regularPrice_desc">Preço: Maior p/ Menor</option>
              <option value="regularPrice_asc">Preço: Menor p/ Maior</option>
              <option value="created_at_desc">Mais Recente</option>
              <option value="created_at_asc">Mais Antigo</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white rounded-xl text-sm uppercase p-2 hover:bg-slate-800 transition">
            Pesquisar
          </button>
        </form>
      </div>

      <div className="flex-1 p-5">
  <h1 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-4">Resultados</h1>

  {loading && <p className="text-lg text-center text-slate-700">A processar...</p>}
  {!loading && houses.length === 0 && (
    <p className="text-lg text-center text-slate-700">Nenhum resultado encontrado</p>
  )}

  {/* Grid de 3 colunas */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {houses.map((house) => (
      <HouseItems key={house.id || house._id} house={house} />
    ))}
  </div>

  {showMore && (
    <button
      onClick={handleShowMore}
      className="mt-6 w-full text-green-700 p-3 hover:underline"
    >
      Mostrar mais
    </button>
  )}
    </div>

    </div>
  );
}
