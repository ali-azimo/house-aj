import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js"; // ajuste o caminho

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Credenciais inválidas");
      }
      const data = await res.json();
      dispatch(signInSuccess(data));
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Iniciar Sessão
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Palavra-passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
          >
            {loading ? "A autenticar..." : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Não tem conta?{" "}
          <a
            href="/signup"
            className="font-medium text-gray-900 hover:underline"
          >
            Registe-se
          </a>
        </p>
      </div>
    </div>
  );
}
