import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
import { FaInfoCircle, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractUserRole = (data) => {
    // Verifica várias possíveis estruturas de dados
    if (data.role) return data.role;
    if (data.user && data.user.role) return data.user.role;
    if (data.data && data.data.role) return data.data.role;
    if (data.userData && data.userData.role) return data.userData.role;
    
    // Valor padrão se nenhum role for encontrado
    return "user";
  };

  const determineRedirectPath = (userRole) => {
    // Define os redirecionamentos baseados no role
    const redirectPaths = {
      admin: "/dashboard",
      customer: "/customer/dashboard",
      agent: "/agent/dashboard",
      user: "/",
      default: "/"
    };
    
    return redirectPaths[userRole] || redirectPaths.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.message || data.error || "Credenciais inválidas";
        throw new Error(errorMessage);
      }
      
      console.log("Dados completos da API:", data);
      
      // Extrai o role do usuário
      const userRole = extractUserRole(data);
      console.log("Role extraído:", userRole);
      
      // Dispatch dos dados do usuário para o Redux
      dispatch(signInSuccess(data));
      
      // Pequeno delay para garantir que o estado do Redux seja atualizado
      setTimeout(() => {
        const redirectPath = determineRedirectPath(userRole);
        console.log("Redirecionando para:", redirectPath);
        navigate(redirectPath, { replace: true });
      }, 100);
      
    } catch (err) {
      console.error("Erro detalhado no login:", err);
      dispatch(signInFailure(err.message || "Erro ao fazer login. Verifique suas credenciais."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gray-900 p-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-900">
              <FaHome className="text-lg" />
            </span>
            <span className="text-xl font-bold">ImoElite</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Iniciar Sessão</h2>
          <p className="text-gray-300 mt-1">Acesse sua conta ImoElite</p>
        </div>
        
        <div className="p-6">
          {/* Mensagem de sucesso ao redirecionar do cadastro */}
          {location.state?.message && (
            <div className="rounded-xl bg-green-50 p-3 mb-4">
              <p className="text-sm text-green-700 flex items-center">
                <FaInfoCircle className="mr-2" />
                {location.state.message}
              </p>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors pr-12"
                  placeholder="Sua palavra-passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-sm text-red-700 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-white font-semibold shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-70 transition-colors flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  A autenticar...
                </>
              ) : "Entrar"}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600 text-sm">OU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <OAuth/>
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <Link
              to="/signup"
              className="font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
            >
              Registe-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}