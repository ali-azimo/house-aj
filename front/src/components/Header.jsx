import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaPhoneAlt, 
  FaUserCircle, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";
const navLinks = [
  { label: "Início", href: "/" },
  { label: "Comprar", href: "/comprar" },
  { label: "Arrendar", href: "/arrendar" },
  { label: "Sobre", href: "/about" },
  { label: "Contactos", href: "/contactos" },
];

export default function HeaderImobiliaria() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  // Handler para scroll com useCallback para otimização
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const onClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open, mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(signOutUserStart());
    // Simulação: aqui iria a chamada ao backend
    setTimeout(() => {
      dispatch(signOutUserSuccess());
      setOpen(false);
      navigate("/");
    }, 800);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur shadow-md" : "bg-white"
        }`}
        aria-label="Cabeçalho principal"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group" 
              aria-label="Página inicial"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gray-900 text-white shadow-md transition-transform group-hover:scale-105">
                <FaHome className="text-lg" />
              </span>
              <div className="leading-tight">
                <span className="block text-base font-bold tracking-tight text-gray-900 group-hover:opacity-90">
                  ImoElite
                </span>
                <span className="block text-xs text-gray-500">Imobiliária Profissional</span>
              </div>
            </Link>

            {/* Navegação desktop */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Ações à direita */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="tel:+258845826662"
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaPhoneAlt aria-hidden="true" />
                <span className="hidden lg:inline">+258 845 826 662</span>
              </a>

              {!currentUser ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignInAlt aria-hidden="true" />
                    <span>Iniciar sessão</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-black transition-all"
                  >
                    <FaUserPlus aria-hidden="true" />
                    <span>Registar</span>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setOpen((s) => !s)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={open}
                  >
                    <FaUserCircle className="text-lg" aria-hidden="true" />
                    <span className="max-w-[120px] truncate">{currentUser?.username || "Conta"}</span>
                  </button>
                  {open && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl z-50 animate-fade-in"
                    >
                      <Link 
                        to="/painel" 
                        className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Painel
                      </Link>
                      <Link 
                        to="/favoritos" 
                        className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Favoritos
                      </Link>
                      <Link 
                        to="/anuncios" 
                        className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Os meus anúncios
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut />
                        Terminar sessão
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Link
                to="/anunciar"
                className="ml-1 inline-flex items-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              >
                Anunciar Imóvel
              </Link>
            </div>

            {/* Botão mobile */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-2xl border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Conteúdo do menu */}
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 group"
                  onClick={closeMobileMenu}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gray-900 text-white shadow-md">
                    <FaHome className="text-lg" />
                  </span>
                  <div className="leading-tight">
                    <span className="block text-base font-bold tracking-tight text-gray-900">
                      ImoElite
                    </span>
                    <span className="block text-xs text-gray-500">Imobiliária Profissional</span>
                  </div>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="rounded-2xl p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Fechar menu"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            <nav className="p-5 space-y-2" aria-label="Navegação mobile">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="block text-base font-medium text-gray-700 hover:text-gray-900 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 bg-gray-50">
              {!currentUser ? (
                <div className="space-y-3">
                  <Link
                    to="/signin"
                    className="flex items-center gap-2 justify-center rounded-2xl px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <FaSignInAlt aria-hidden="true" />
                    <span>Iniciar sessão</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 justify-center rounded-2xl bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-black transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <FaUserPlus aria-hidden="true" />
                    <span>Registar</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-700">
                    <FaUserCircle className="text-xl" />
                    <span className="max-w-[180px] truncate">{currentUser?.username || "Conta"}</span>
                  </div>
                  <Link
                    to="/painel"
                    className="block rounded-xl px-3 py-2 text-base text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Painel
                  </Link>
                  <Link
                    to="/favoritos"
                    className="block rounded-xl px-3 py-2 text-base text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Favoritos
                  </Link>
                  <Link
                    to="/anuncios"
                    className="block rounded-xl px-3 py-2 text-base text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Os meus anúncios
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <FiLogOut />
                    Terminar sessão
                  </button>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-300">
                <a
                  href="tel:+258845826662"
                  className="flex items-center gap-2 justify-center rounded-2xl border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <FaPhoneAlt aria-hidden="true" />
                  <span>+258 845 826 662</span>
                </a>
                
                <Link
                  to="/anunciar"
                  className="mt-3 flex items-center justify-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-3 text-base font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
                  onClick={closeMobileMenu}
                >
                  Anunciar Imóvel
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}