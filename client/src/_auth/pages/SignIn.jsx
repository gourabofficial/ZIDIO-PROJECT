import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useSignIn, useClerk } from '@clerk/clerk-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  
  // Clerk hooks
  const { signIn } = useSignIn();
  const { client } = useClerk();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // User is signed in
        navigate('/');
      } else {
        // Additional verification may be needed
        setErrorMessage('Additional verification required');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await client.signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/oauth-callback',
        redirectUrlComplete: '/'
      });
    } catch (error) {
      console.error('Google authentication error:', error);
      setErrorMessage('Failed to authenticate with Google. Please try again.');
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter your email to request OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Start the email OTP flow
      const result = await signIn.create({
        strategy: 'email_code',
        identifier: email,
      });
      
      if (result.status === 'needs_first_factor') {
        setShowOtpSection(true);
        setIsOtpSent(true);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Complete the email OTP verification
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      });
      
      if (result.status === 'complete') {
        // User is signed in
        navigate('/');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpChange = (value, index) => {
    // Update OTP state
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);
    setOtp(newOtp.join(''));
    
    // Auto-focus next input if this one is filled
    if (value && index < 5) {
      const inputs = document.querySelectorAll('.otp-input');
      if (inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors">
            <FiArrowLeft className="mr-2" />
            Back to home
          </Link>

          <h2 className="text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <Link to="/sign-up" className="font-medium text-purple-400 hover:text-purple-300">
              create a new account
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
        
        {isOtpSent && showOtpSection && (
          <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm">
            OTP sent to your email
          </div>
        )}

        {!showOtpSection ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
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

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="font-medium text-purple-400 hover:text-purple-300"
                  >
                    Sign in with OTP instead
                  </button>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                    isLoading
                      ? 'bg-purple-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0c0e16] text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-white bg-[#1e293b] hover:bg-[#2d3748] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-4">
                Please enter the OTP sent to your email {email}
              </p>
              <div className="flex space-x-2 justify-center">
                {Array(6).fill(0).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input w-12 h-12 text-center border border-gray-700 rounded-md bg-[#1e293b] text-white text-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={otpInputs[index]}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      // Handle backspace to move to previous input
                      if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
                        const inputs = document.querySelectorAll('.otp-input');
                        inputs[index - 1].focus();
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                  isLoading || otp.length !== 6
                    ? 'bg-purple-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify OTP'}
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowOtpSection(false);
                  setIsOtpSent(false);
                }}
                className="text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                Back to login
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;