import React, { useState } from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin }) => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password');

  const handleDemoLogin = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80)'}}></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-orange-400">FoodApp</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-200">
          Discover and order delicious food from the best local restaurants.
        </p>

        <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Try the Demo</h2>
          <form onSubmit={handleDemoLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/80 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/80 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-orange-500 text-white font-bold px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
            >
              Login as Customer
            </button>
          </form>
          <div className="mt-4 text-center">
             <button 
              onClick={() => { setEmail('owner@example.com'); setPassword('password'); }}
              className="text-sm text-orange-200 hover:text-white transition"
            >
              (or click here to set owner credentials)
            </button>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href={`${config.BACKEND_URL}/admin`} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Access Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
