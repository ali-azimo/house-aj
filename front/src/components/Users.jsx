import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch("/api/users", {
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include"

      });
      
      // Verificar se a resposta foi bem-sucedida
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Verificar diferentes formatos de resposta
      let usersArray = [];
      
      if (Array.isArray(data)) {
        // Se a resposta já é um array
        usersArray = data;
      } else if (data.users && Array.isArray(data.users)) {
        // Se a resposta tem propriedade 'users' que é um array
        usersArray = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        // Se a resposta tem propriedade 'data' que é um array
        usersArray = data.data;
      } else {
        console.warn("Formato de resposta inesperado:", data);
        setError("Formato de dados inesperado da API");
      }
      
      setUsers(usersArray);
      
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente apagar este usuário?")) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status} ao deletar usuário`);
      }
      
      // Recarregar a lista de usuários
      fetchUsers();
      
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      alert("Erro ao deletar usuário: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Usuários Cadastrados</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Carregando usuários...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Usuários Cadastrados</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro: </strong> {error}
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Usuários Cadastrados</h2>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Atualizar
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum usuário encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Nome</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Tipo</th>
                <th className="py-3 px-4 border-b text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{user.username || "N/A"}</td>
                  <td className="py-3 px-4 border-b">{user.email || "N/A"}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex gap-2">
                      <Link 
                        to={`/dashboard/edit_user/${user._id || user.id}`} 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(user._id || user.id)} 
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Apagar
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
  );
}