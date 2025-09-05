import React, { useEffect, useState } from "react";
import { 
  FaUserPlus, FaEdit, FaTrash, FaUser, FaUserTie, FaUsers 
} from "react-icons/fa";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
    avatar: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storage = getStorage(app);

  // Buscar lista de utilizadores
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError("Erro ao carregar utilizadores");
      }
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
      setError("Erro de conexão ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Upload Avatar para Firebase
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB");
      return;
    }

    const storageRef = ref(storage, `avatars/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload está ${progress}% completo`);
      },
      (error) => {
        console.error("Erro no upload:", error);
        setError("Erro ao fazer upload da imagem");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, avatar: url }));
        setSuccess("Imagem carregada com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      }
    );
  };

  const validateForm = () => {
    if (!formData.username || !formData.email) {
      setError("Nome de utilizador e email são obrigatórios");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const url = editingUser
        ? `/api/user/${editingUser.id}`
        : "/api/auth/create";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success || data.message) {
        setSuccess(editingUser ? "Utilizador atualizado com sucesso!" : "Utilizador criado com sucesso!");
        fetchUsers();
        resetForm();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Erro ao salvar utilizador");
      }
    } catch (error) {
      console.error("Erro ao salvar utilizador:", error);
      setError("Erro de conexão ao salvar utilizador");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      role: "user",
      avatar: "",
    });
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "user",
      avatar: user.avatar || "",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este utilizador?")) return;

    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success || data.message) {
        setUsers(users.filter((u) => u.id !== id));
        setSuccess("Utilizador excluído com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Erro ao excluir utilizador");
      }
    } catch (error) {
      console.error("Erro ao excluir utilizador:", error);
      setError("Erro de conexão ao excluir utilizador");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <FaUserTie className="text-red-500" />;
      case "customer": return <FaUsers className="text-blue-500" />;
      default: return <FaUser className="text-green-500" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin": return "Administrador";
      case "customer": return "Cliente";
      default: return "Utilizador";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#101828]"></div>
        <p className="ml-4 text-gray-600">A carregar utilizadores...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101828] mb-2">Gestão de Utilizadores</h1>
        <p className="text-gray-600">Administre os utilizadores do sistema</p>
      </div>

      {/* Mensagens de status */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#101828] mb-6 flex items-center gap-2">
            <FaUserPlus className="text-[#101828]" /> 
            {editingUser ? "Editar Utilizador" : "Adicionar Novo Utilizador"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Utilizador *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nome de utilizador"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Telefone"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Função *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
              >
                <option value="user">Utilizador</option>
                <option value="customer">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
              {formData.avatar && (
                <div className="mt-2">
                  <img
                    src={formData.avatar}
                    alt="Pré-visualização do avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-[#101828] text-white py-3 px-6 rounded-lg hover:bg-[#0a1424] transition-colors flex-1"
              >
                {editingUser ? "Atualizar" : "Criar Utilizador"}
              </button>
              
              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de utilizadores */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#101828] mb-6">Utilizadores do Sistema</h2>
          
          {users.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FaUsers className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>Nenhum utilizador encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Utilizador</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Função</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Criado em</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-8 h-8 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2">{getRoleLabel(user.role)}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("pt-PT") : "-"}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-[#101828] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar utilizador"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir utilizador"
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
    </div>
  );
}
