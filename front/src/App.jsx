import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Home from './pages/Home'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>

        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
