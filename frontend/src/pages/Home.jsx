import React from 'react'
import Navbar from '../components/Navbar'
import HomeBanner from '../components/HomeBanner'
import HomeCars from '../components/HomeCars'
import Testimonial from '../components/Testimonial'

export const Home = () => {
  return (
    <div>
      <Navbar />
      <HomeBanner />
      <HomeCars />
      <Testimonial />
    </div>
  )
}
