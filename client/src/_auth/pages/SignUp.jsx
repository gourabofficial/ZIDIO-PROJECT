import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp, useClerk } from '@clerk/clerk-react';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { client } = useClerk();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Reset form error when user makes changes
    if (errorMessage) setErrorMessage('');
  }, [formData, otp]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Basic form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsOtpSent(true);
      console.log("Email verification code sent", result);
    } catch (error) {
      console.error("Error starting sign up:", error);
      setErrorMessage(
        error.errors?.[0]?.longMessage || 
        error.errors?.[0]?.message || 
        "Failed to start sign up process, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!otp) {
      setErrorMessage("Please enter the verification code sent to your email");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        console.log("Additional verification steps required:", result);
        setErrorMessage("Verification incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setErrorMessage(
        error.errors?.[0]?.longMessage || 
        error.errors?.[0]?.message || 
        "Invalid verification code, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await client.signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth",
        redirectUrlComplete: "/" //  i am changed
      });
    } catch (error) {
      console.error("Error with Google sign-up:", error);
      setErrorMessage("Failed to sign up with Google, please try again.");
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setErrorMessage(''); // Clear any previous errors
      setIsLoading(false);
      // Show success message - you could use a toast notification instead
      alert("Verification code resent successfully!");
    } catch (error) {
      console.error("Resend error:", error);
      setErrorMessage(
        error.errors?.[0]?.message || "Failed to resend verification code"
      );
      setIsLoading(false);
    }
  };

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center mt-20">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" mt-20 min-h-screen bg-[#0c0e16] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to home
          </Link>

          <h2 className="text-3xl font-extrabold text-white">
            {isOtpSent ? "Verify your email" : "Create a new account"}
          </h2>
          
          <p className="mt-2 text-sm text-gray-400">
            {isOtpSent 
              ? "Please enter the verification code sent to your email" 
              : (
                <>
                  Or{" "}
                  <Link
                    to="/sign-in"
                    className="font-medium text-purple-400 hover:text-purple-300"
                  >
                    sign in to existing account
                  </Link>
                </>
              )
            }
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-900/20 text-red-400 p-3 border border-red-800/50 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 pl-10 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 pl-10 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full px-4 py-3 pl-10 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (8+ characters)"
                className="w-full px-4 py-3 pl-10 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 pl-10 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            
            {/* Clerk Captcha */}
            <div id="clerk-captcha" className="w-full" />
            
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                isLoading
                  ? "bg-purple-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
            >
              {isLoading ? "Sending code..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
            <div className="relative">
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Verification code"
                className="w-full px-4 py-3 bg-[#1e293b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 text-center tracking-wider"
                autoComplete="one-time-code"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                  isLoading
                    ? "bg-purple-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
              >
                {isLoading ? "Verifying..." : "Create Account"}
              </button>
              
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={isLoading}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Resend code
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Edit information
                </button>
              </div>
            </div>
          </form>
        )}

        {!isOtpSent && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-700"></div>
              <span className="px-4 text-sm text-gray-400 font-medium">OR</span>
              <div className="flex-grow h-px bg-gray-700"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1e293b] border border-gray-700 text-white rounded-md hover:bg-[#2d3748] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;