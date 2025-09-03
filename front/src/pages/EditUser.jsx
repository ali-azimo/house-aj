import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", role: "customer" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setForm({ username: data.username, email: data.email, role: data.role });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" name="username" value={form.username} onChange={handleChange} className="border p-2 rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded">
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Atualizar</button>
      </form>
    </div>
  );
}
