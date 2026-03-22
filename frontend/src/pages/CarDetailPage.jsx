import React from 'react'
import CarDetail from '../components/CarDetail'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CarDetailPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <CarDetail />
            <Footer />
        </div>
    )
}

export default CarDetailPage