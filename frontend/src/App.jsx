import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import Login from './components/Login.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <ToastContainer />

    </>
  );
};

export default App