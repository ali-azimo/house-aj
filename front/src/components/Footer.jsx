import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin,
  FaArrowRight
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-900 shadow-md">
                <FaHome className="text-lg" />
              </span>
              <div className="leading-tight">
                <span className="block text-lg font-bold text-white">ImoElite</span>
                <span className="block text-xs text-gray-400">Imobiliária Profissional</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Encontre o imóvel dos seus sonhos com a ImoElite. Oferecemos as melhores opções de compra, venda e arrendamento em Moçambique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-10 after:bg-white">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link to="/comprar" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Comprar</span>
                </Link>
              </li>
              <li>
                <Link to="/arrendar" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Arrendar</span>
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Sobre Nós</span>
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contactos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-10 after:bg-white">
              Nossos Serviços
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Venda de Imóveis</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Arrendamento</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Avaliações</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Consultoria</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white flex items-center transition-colors group">
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Gestão de Propriedades</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-10 after:bg-white">
              Contactos
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-gray-400" />
                <span className="text-gray-400 text-sm">Av. 25 de Setembro, nº 123<br />Maputo, Moçambique</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-gray-400" />
                <a href="tel:+258845826662" className="text-gray-400 hover:text-white transition-colors text-sm">
                  +258 845 826 662
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-gray-400" />
                <a href="mailto:info@imoelite.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                  info@imoelite.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscreva à nossa newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-gray-800 text-white px-3 py-2 text-sm rounded-l-lg focus:outline-none focus:ring-1 focus:ring-gray-500 w-full"
                />
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded-r-lg transition-colors">
                  Subscrever
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-3 md:mb-0">
            © {new Date().getFullYear()} ImoElite. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Serviço</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}