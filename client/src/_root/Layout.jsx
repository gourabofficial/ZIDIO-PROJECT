import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Outlet /> {/* Where Product component is rendered */}
      </main>
      
      <Footer className="flex-shrink-0" />
    </div>
  )
}

export default Layout