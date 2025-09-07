import { FaHeart } from "react-icons/fa";
import React, { useState, useEffect, useCallback } from "react";

export default function LikeButton({ houseId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const [countRes, userRes] = await Promise.all([
        fetch(`/api/likes/count/${houseId}`),
        fetch(`/api/likes/check/${houseId}`, { credentials: "include" })
      ]);

      const [countData, userData] = await Promise.all([
        countRes.json(),
        userRes.json()
      ]);

      if (countData.success) setCount(countData.likes);
      if (userData.success) setLiked(userData.liked);
    } catch (err) {
      console.error("Erro ao buscar likes:", err);
    }
  }, [houseId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/likes/toggle`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Atualização otimista
        setLiked(data.liked);
        setCount(prev => data.liked ? prev + 1 : prev - 1);

        if (data.liked) {
          setAnimating(true);
          setTimeout(() => setAnimating(false), 300);
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar like:", err);
      // Revert em caso de erro
      fetchLikes();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 text-sm">
      <button 
        onClick={toggleLike}
        disabled={isLoading}
        aria-label={liked ? "Remover like" : "Dar like"}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <FaHeart
          className={`text-sm cursor-pointer transition-all duration-300 ${
            liked ? "text-red-600" : "text-gray-400"
          } ${animating ? "scale-125" : ""} ${
            isLoading ? "opacity-50" : ""
          }`}
        />
      </button>
      <span className="min-w-[60px]">
        {count} {count === 1 ? "Like" : "Likes"}
      </span>
    </div>
  );
}