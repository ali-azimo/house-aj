import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import CadHouse from "./pages/CadHouse.jsx";
import Users from "./components/Users.jsx";
import EditUser from "./pages/EditUser.jsx";
import Stats from "./pages/Stats.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ShowItem from "./pages/ShowItem.jsx";
import HouseDetail from "./pages/HouseDetail.jsx";
import UpdateHouse from "./pages/UpdateHouse.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:type/:id" element={<HouseDetail />} />

        {/* Dashboard - Admin e Customer */}
        <Route element={<PrivateRoute allowedRoles={["admin", "customer"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={<h2 className="text-xl font-bold">Bem-vindo ao Dashboard</h2>}
            />
            <Route path="cad_house" element={<CadHouse />} />
            <Route path="update-house/:id" element={<UpdateHouse />} />
            <Route path="edit_profile" element={<EditProfile />} />
            <Route path="show_item" element={<ShowItem />} />

            {/* Apenas Admin */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="users" element={<Users />} />
              <Route path="edit_user/:id" element={<EditUser />} />
              <Route path="stats" element={<Stats />} />
            </Route>
          </Route>
        </Route>

        {/* Qualquer rota inválida → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
