import React from 'react';
import { FaHome, FaUsers, FaTrophy, FaHandshake, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function About() {
  const teamMembers = [
    {
      name: "Carlos Santos",
      role: "CEO & Fundador",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      description: "Com mais de 15 anos de experiência no mercado imobiliário."
    },
    {
      name: "Ana Muchanga",
      role: "Diretora Comercial",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      description: "Especialista em negociações e gestão de carteira de clientes."
    },
    {
      name: "João Sitoe",
      role: "Corretor Sênior",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      description: "Conhece cada detalhe do mercado imobiliário de Maputo."
    },
    {
      name: "Maria Chissano",
      role: "Design de Interiores",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      description: "Transforma propriedades em lares aconchegantes."
    }
  ];

  const stats = [
    { number: "500+", label: "Imóveis Vendidos" },
    { number: "300+", label: "Clientes Satisfeitos" },
    { number: "10+", label: "Anos de Experiência" },
    { number: "95%", label: "Taxa de Satisfação" }
  ];

  const values = [
    {
      icon: <FaHandshake className="text-3xl mb-4" />,
      title: "Confiança",
      description: "Construímos relações baseadas na transparência e honestidade com nossos clientes."
    },
    {
      icon: <FaTrophy className="text-3xl mb-4" />,
      title: "Excelência",
      description: "Buscamos sempre superar expectativas e entregar os melhores resultados."
    },
    {
      icon: <FaUsers className="text-3xl mb-4" />,
      title: "Compromisso",
      description: "Estamos comprometidos em encontrar a melhor solução para cada cliente."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#101828] to-[#1e2a3b] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre a ImoElite</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sua parceira de confiança no mercado imobiliário de Moçambique
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                Fundada em 2013, a ImoElite nasceu da paixão por conectar pessoas aos seus lares dos sonhos. 
                Começamos como uma pequena equipe com um grande sonho: revolucionar o mercado imobiliário em Moçambique.
              </p>
              <p className="text-gray-600 mb-4">
                Ao longo dos anos, crescemos e nos tornamos referência no sector, sempre mantendo nossos valores 
                de transparência, excelência e compromisso com cada cliente.
              </p>
              <p className="text-gray-600">
                Hoje, orgulhamo-nos de ter facilitado a realização do sonho da casa própria para centenas de famílias 
                moçambicanas e continuamos empenhados em oferecer o melhor serviço do mercado.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Nossa equipe" 
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#101828] text-white p-6 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm">Anos de Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Valores</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Princípios que guiam cada decisão e ação em nossa empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-[#101828] flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-[#101828] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossa Equipe</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Profissionais dedicados e experientes prontos para ajudá-lo a encontrar o imóvel perfeito
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-60 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-[#101828] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Entre em Contato</h2>
              <p className="text-gray-600 mb-8">
                Estamos sempre disponíveis para esclarecer suas dúvidas e ajudá-lo a encontrar o imóvel dos seus sonhos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-[#101828] text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Endereço</h3>
                    <p className="text-gray-600">Av. 25 de Setembro, nº 123, Maputo, Moçambique</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="text-[#101828] text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Telefone</h3>
                    <p className="text-gray-600">+258 84 582 6662</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaEnvelope className="text-[#101828] text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@imoelite.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Envie uma Mensagem</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent" 
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent" 
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent" 
                    placeholder="Como podemos ajudá-lo?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#101828] text-white py-3 rounded-lg font-medium hover:bg-[#0a1424] transition-colors"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}