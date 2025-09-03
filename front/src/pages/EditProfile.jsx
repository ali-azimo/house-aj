import React, { useState, useEffect } from "react";

export default function EditProfile() {
  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setForm({ username: user.username, email: user.email, phone: user.phone });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" name="username" value={form.username} onChange={handleChange} className="border p-2 rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Atualizar</button>
      </form>
    </div>
  );
}
