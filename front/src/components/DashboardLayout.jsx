import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaUser, 
  FaHouseUser, 
  FaSignOutAlt, 
  FaUsers, 
  FaChartBar,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Acessar o usuário atual do Redux
  const { currentUser } = useSelector((state) => state.user);
  
  // Extrair o role do usuário (pode estar em diferentes níveis do objeto)
  const userRole = currentUser?.role || 
                  (currentUser?.user && currentUser.user.role) || 
                  (currentUser?.data && currentUser.data.role) || 
                  "user";

  // Verificar tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false); // Fechar sidebar em mobile por padrão
      } else {
        setOpen(true); // Abrir sidebar em desktop por padrão
      }
    };

    handleResize(); // Definir estado inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(signOutUserStart());
    // Simulação: aqui iria a chamada ao backend
    setTimeout(() => {
      dispatch(signOutUserSuccess());
      navigate("/");
    }, 500);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay para mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30
        bg-gray-900 text-white 
        ${open ? "w-64" : "w-0 lg:w-16"} 
        transition-all duration-300 flex flex-col
        shadow-lg h-full
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {open && <span className="font-bold text-lg">ImoElite Dashboard</span>}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-300 hover:text-white p-1 rounded"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
            onClick={closeSidebarOnMobile}
          >
            <FaHome className="text-lg min-w-[20px]" /> 
            {open && <span>Início</span>}
          </Link>

          {/* Links Admin */}
          {userRole === "admin" && (
            <>
              <Link 
                to="/dashboard/users" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaUsers className="text-lg min-w-[20px]" /> 
                {open && <span>Gerir Utilizadores</span>}
              </Link>
              <Link 
                to="/dashboard/cad_house" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaHouseUser className="text-lg min-w-[20px]" /> 
                {open && <span>Cadastrar Imóvel</span>}
              </Link>
              <Link 
                to="/dashboard/show_item" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaHouseUser className="text-lg min-w-[20px]" /> 
                {open && <span>Visualizar Imóvel</span>}
              </Link>
              <Link 
                to="/dashboard/stats" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaChartBar className="text-lg min-w-[20px]" /> 
                {open && <span>Estatísticas</span>}
              </Link>
            </>
          )}

          {/* Links Customer */}
          {userRole === "customer" && (
            <>
              <Link 
                to="/dashboard/cad_house" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaHouseUser className="text-lg min-w-[20px]" /> 
                {open && <span>Meus Imóveis</span>}
              </Link>
              <Link 
                to="/dashboard/edit_profile" 
                className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                onClick={closeSidebarOnMobile}
              >
                <FaUser className="text-lg min-w-[20px]" /> 
                {open && <span>Editar Perfil</span>}
              </Link>
            </>
          )}

          {/* Links para User normal (se necessário) */}
          {userRole === "user" && (
            <Link 
              to="/dashboard/edit_profile" 
              className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
              onClick={closeSidebarOnMobile}
            >
              <FaUser className="text-lg min-w-[20px]" /> 
              {open && <span>Meu Perfil</span>}
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 mt-auto hover:bg-gray-700 transition-colors w-full"
        >
          <FaSignOutAlt className="text-lg min-w-[20px]" /> 
          {open && <span>Sair</span>}
        </button>
      </div>

      {/* Área de conteúdo */}
      <div className={`flex-1 overflow-auto p-4 lg:p-6 transition-all duration-300 ${isMobile && open ? 'ml-0' : ''}`}>
        {/* Botão para abrir sidebar em mobile quando fechada */}
        {isMobile && !open && (
          <button 
            onClick={() => setOpen(true)}
            className="fixed top-4 left-4 z-10 bg-gray-900 text-white p-2 rounded-lg shadow-lg lg:hidden"
          >
            <FaBars />
          </button>
        )}
        
        <Outlet />
      </div>
    </div>
  );
}