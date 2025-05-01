import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1" style={{ minHeight: 'calc(100vh - 250px)' }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout