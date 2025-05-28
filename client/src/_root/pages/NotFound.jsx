import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHome, AiOutlineArrowLeft } from 'react-icons/ai'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Scary Background Elements */}
      <div className="absolute inset-0">
        {/* Floating scary dots */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-orange-500 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-yellow-500 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-35"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-yellow-600 rounded-full animate-ping opacity-20"></div>
        
        {/* Scary shadows/mist effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-red-900/5 to-orange-900/5"></div>
        
        {/* Moving shadows */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-red-900/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-orange-900/10 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 text-center relative z-10">
        {/* 404 Number with Scary Animation */}
        <div className="space-y-6">
          <h1 className="text-8xl md:text-9xl font-extrabold text-white tracking-tight animate-pulse drop-shadow-2xl">
            404
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Error Message with Spooky Text */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white animate-pulse">
            Page Not Found 
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            The page you seek has vanished into the <span className="text-red-400 animate-pulse">darkness</span>...
            <br />
            <span className="text-orange-400 text-sm animate-bounce">Never to return</span>
          </p>
        </div>

        {/* Action Buttons with Scary Hover Effects */}
        <div className="space-y-4 pt-8">
          <Link
            to="/"
            className="group inline-flex items-center justify-center w-full px-8 py-4 text-base font-medium rounded-lg text-black bg-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
          >
            <AiOutlineHome className="w-5 h-5 mr-3 group-hover:animate-bounce" />
            Escape to Safety
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center w-full px-8 py-4 border border-gray-600 text-base font-medium rounded-lg text-white bg-transparent hover:bg-red-900/20 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition duration-300 ease-in-out hover:shadow-lg hover:shadow-orange-500/25"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-3 group-hover:animate-pulse" />
            Return from Whence You Came
          </button>
        </div>

        {/* Additional Help with Spooky Theme */}
        <div className="pt-8">
          <p className="text-sm text-gray-500 animate-pulse">
            Lost in the shadows?{' '}
            <Link
              to="/support"
              className="text-orange-400 hover:text-red-400 underline transition duration-200 hover:animate-pulse"
            >
              Summon help from the spirits
            </Link>
          </p>
        </div>
      </div>

      {/* Additional Scary Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Flickering effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/5 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-orange-500 rounded-full animate-ping opacity-30"></div>
      </div>
    </div>
  )
}

export default NotFound