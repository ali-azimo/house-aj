import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SimilarItems({ type, id }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        console.log("Buscando similares:", `/api/similar/${type}/${id}`);
        const res = await fetch(`/api/similar/${type}/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) throw new Error("Erro na API de similares");
        const raw = await res.json();
        console.log("Resposta similares:", raw);

        const data = raw.data ? raw.data : raw;

        if (Array.isArray(data)) {
          const normalized = data.map(d => {
            let parsedImages = [];
            try {
              if (typeof d.imageUrls === "string") {
                parsedImages = JSON.parse(d.imageUrls);
              } else if (Array.isArray(d.imageUrls)) {
                parsedImages = d.imageUrls;
              }
            } catch (e) {
              console.warn("Erro ao parsear imageUrls:", e);
            }

            return {
              ...d,
              id: d.id || d._id,
              imageUrls: parsedImages,
            };
          });
          setItems(normalized);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Erro ao buscar similares:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSimilar();
  }, [type, id]);

  if (loading) return <p className="text-gray-500">Carregando itens semelhantes...</p>;

  if (!items.length) return <p className="text-gray-500">Nenhum item semelhante encontrado.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/${type}/${item.id}`}
          className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
        >
          <div
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.imageUrls[0] || '/placeholder.jpg'})` }}
          />
          <div className="p-4">
            <h4 className="font-semibold text-[#1F2E54]">{item.name || 'Imóvel'}</h4>
            <p className="text-gray-600 text-sm">{item.address || 'Sem endereço'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
