'use client';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://project-managment-backend-r4hz.onrender.com/api/auth/login', {
        email,
        password,
      });
      // Assuming the backend returns a token or user data on successful login
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      router.push('/'); // Redirect to homepage after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-[900px] h-[500px] shadow-2xl rounded-lg overflow-hidden">
        {/* Left Section - Sign In Form */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold text-[#EDA415] mb-6">Sign In to Your Account</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSignIn} className="space-y-4 w-full max-w-xs">
            <div className="flex items-center bg-gray-100 rounded px-4 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent outline-none w-full text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded px-4 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none w-full text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a href="#" className="text-sm text-gray-600 mt-4 hover:underline">
              Forget Password?
            </a>
            <button
              type="submit"
              className="mt-6 bg-[#EDA415] hover:bg-yellow-600 text-white px-10 py-3 rounded-full transition"
            >
              SIGN IN
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div
          className="w-full md:w-1/2 bg-[#003F62] text-white flex flex-col justify-center items-center p-8 relative bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="absolute inset-0" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">Hello Friend!</h2>
          <p className="text-center text-sm mb-6 relative z-10">
            Enter your personal details and start your journey with us
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="border px-8 py-2 rounded-full text-white hover:bg-white hover:text-[#073B4C] transition relative z-10"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;