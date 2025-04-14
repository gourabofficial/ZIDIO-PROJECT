import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiUser } from 'react-icons/fi';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isLogin) {
      // Login logic
      if (!email || !password) {
        setFormError('Please enter both email and password');
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        navigate(from); // Redirect back or to home page
      } else {
        setFormError(result.error || 'Failed to login. Please try again.');
      }
    } else {
      // Signup logic
      if (!name || !email || !password || !confirmPassword) {
        setFormError('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }

      const result = await signup(name, email, password);

      if (result.success) {
        navigate('/'); // Redirect to home page after successful signup
      } else {
        setFormError(result.error || 'Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background stars */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>

      {/* Nebula effects */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors">
            <FiArrowLeft className="mr-2" />
            Back to home
          </Link>

          <h2 className="text-3xl font-extrabold text-white">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              {isLogin ? 'create a new account' : 'sign in to existing account'}
            </button>
          </p>
        </div>

        {formError && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm">
            {formError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-[#1e293b] focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-[#1e293b] focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-[#1e293b] focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-[#1e293b] focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                loading
                  ? 'bg-purple-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
            >
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;