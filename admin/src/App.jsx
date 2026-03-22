import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddCar from './components/AddCar'
import ManageCars from './components/ManageCars'
import Bookings from './components/Bookings'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddCar />} />
        <Route path="/manage-cars" element={<ManageCars />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App