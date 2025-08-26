import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { FaEye, FaEyeSlash, FaInfoCircle, FaHome } from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    requestAdmin: false,
    adminRequestMessage: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });

    // Verificar força da senha em tempo real
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Fraca";
    if (passwordStrength < 75) return "Média";
    return "Forte";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
      dispatch(signInFailure("As palavras-passe não coincidem"));
      return;
    }
    
    if (formData.password.length < 6) {
      dispatch(signInFailure("A palavra-passe deve ter pelo menos 6 caracteres"));
      return;
    }
    
    dispatch(signInStart());
    
    try {
      // Preparar dados para envio
      const { confirmPassword, ...submitData } = formData;
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Falha no cadastro");
      }
      
      dispatch(signInSuccess(data));
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gray-900 p-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-900">
              <FaHome className="text-lg" />
            </span>
            <span className="text-xl font-bold">ImoElite</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Criar Conta</h2>
          <p className="text-gray-300 mt-1">Junte-se à nossa plataforma imobiliária</p>
        </div>
        
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors"
              placeholder="(+258) 84 123 4567"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Força da palavra-passe:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength < 50 ? "text-red-600" : 
                    passwordStrength < 75 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} 
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Palavra-passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors pr-12"
                placeholder="Digite novamente sua palavra-passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-start mb-2">
              <input
                type="checkbox"
                id="requestAdmin"
                name="requestAdmin"
                checked={formData.requestAdmin}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="requestAdmin" className="text-sm font-medium text-gray-700">
                Solicitar acesso de administrador
              </label>
            </div>
            
            <div className="text-xs text-gray-600 flex items-start mt-1">
              <FaInfoCircle className="mt-0.5 mr-1 flex-shrink-0" />
              <span>
                Marque esta opção se deseja cadastrar propriedades. Sua solicitação será analisada pela nossa equipe.
              </span>
            </div>
            
            {formData.requestAdmin && (
              <div className="mt-3">
                <label htmlFor="adminRequestMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem de solicitação (opcional)
                </label>
                <textarea
                  id="adminRequestMessage"
                  name="adminRequestMessage"
                  value={formData.adminRequestMessage}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors text-sm"
                  placeholder="Explique por que você precisa de acesso de administrador..."
                ></textarea>
              </div>
            )}
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
                A processar...
              </>
            ) : "Criar Conta"}
          </button>
        </form>
        
        <div className="px-6 pb-6">
          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/signin"
              className="font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
            >
              Entrar agora
            </Link>
          </p>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            Ao se registrar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-gray-700">Termos de Serviço</a> e{" "}
            <a href="#" className="underline hover:text-gray-700">Política de Privacidade</a>.
          </div>
        </div>
      </div>
    </div>
  );
}