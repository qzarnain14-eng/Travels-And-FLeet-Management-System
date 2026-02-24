import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CarPage from './pages/CarPage.jsx'
import CarDetailPage from './pages/CarDetailPage.jsx'
import { FaArrowUp } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

//PROTECTED ROUTES
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} />
  }
  return children;
}


const App = () => {

  const [showButton, setShowButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname])

  // SHOW HIDDE BUTTON ON SCROLL
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/cars' element={<CarPage />} />
        <Route path='/car/:id' element={
          <ProtectedRoute>
            <CarDetailPage />
          </ProtectedRoute>
        }
        />
      </Routes>
      <ToastContainer />

      {showButton && (
        <button onClick={scrollUp} className="fixed cursor-pointer bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-700
        text-white shadow-lg transition-colors focus:outline-none" aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />

        </button>
      )}

    </>
  );
};

export default App