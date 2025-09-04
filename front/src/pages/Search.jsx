import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import House from '../../../api/db/db.Mysql.js';
import HouseItems from '../components/HouseItems.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    finished: false,
    offer: false,
    build: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [imos, setImos] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const finishedFromUrl = urlParams.get('finished');
    const buildFromUrl = urlParams.get('build');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      finishedFromUrl ||
      offerFromUrl ||
      buildFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        finished: finishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        build: buildFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchImos = async () => {
      setShowMore(false);
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/houses/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setImos(data);
      setLoading(false);
    };
    fetchImos();
  }, [location.search]);

  const handlerChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' || e.target.id === 'build') {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (e.target.id === 'parking' || e.target.id === 'finished' || e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('finished', sidebardata.finished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfImos = imos.length;
    const startIndex = numberOfImos;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${import.meta.env.VITE_API_KEY_ONRENDER}/api/imo/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setImos([...imos, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-6xl m-auto">

      {/* Sidebar / Formulário */}
      <div className="w-full md:w-[300px] bg-white rounded-xl shadow-md p-5 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Campo de busca */}
          <div className="flex flex-col gap-1">
            <label htmlFor="searchTerm" className="font-semibold text-slate-700">
              Termo de Pesquisa
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Pesquisar..."
              className="border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sidebardata.searchTerm}
              onChange={handlerChange}
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-slate-700">Tipo</span>
            <div className="flex flex-col gap-1 text-sm">
              {["all", "rent", "sale", "build", "offer"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={type}
                    className="w-4 h-4 text-blue-600 rounded-md"
                    onChange={handlerChange}
                    checked={sidebardata.type === type || (type === "offer" && sidebardata.offer)}
                  />
                  {type === "all"
                    ? "Venda & Aluguer"
                    : type === "rent"
                    ? "Aluguer"
                    : type === "sale"
                    ? "Venda"
                    : "Oferta"}
                </label>
              ))}
            </div>
          </div>

          {/* Comodidades */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-slate-700">Comodidades</span>
            <div className="flex flex-col gap-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-4 h-4 text-blue-600 rounded-md"
                  onChange={handlerChange}
                  checked={sidebardata.parking}
                />
                Estacionamento
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="finished"
                  className="w-4 h-4 text-blue-600 rounded-md"
                  onChange={handlerChange}
                  checked={sidebardata.finished}
                />
                Acabado
              </label>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sort_order" className="font-semibold text-slate-700">
              Ordenar por
            </label>
            <select
              onChange={handlerChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="regularPrice_desc">Preço: Maior p/ Menor</option>
              <option value="regularPrice_asc">Preço: Menor p/ Maior</option>
              <option value="createdAt_desc">Mais Recente</option>
              <option value="createdAt_asc">Mais Antigo</option>
            </select>
          </div>

          {/* Botão */}
          <button className="bg-slate-700 text-white rounded-xl text-sm uppercase hover:bg-slate-800 transition p-2">
            Pesquisar
          </button>
        </form>
      </div>

      {/* Resultados */}
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-semibold p-3 text-slate-700">Resultados</h1>

        <div className="p-5 flex flex-wrap gap-4">
          {!loading && imos.length === 0 && (
            <p className="text-lg text-slate-700">Nenhum resultado encontrado</p>
          )}
          {loading && (
            <p className="text-lg text-slate-700 text-center w-full">A processar...</p>
          )}
          {!loading &&
            imos &&
            imos.map((imo) => <ImoItems key={imo._id} imo={imo} />)}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-4 text-center w-full"
            >
              Mostrar mais
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
