import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const manifest = new Manifest();

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const result = await testBackendConnection();
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          if (currentUser) {
            setUser(currentUser);
            setCurrentScreen('dashboard');
          }
        } catch (error) {
          console.log('👻 [APP] No active session found.');
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', result.error);
      }
    };
    
    checkConnectionAndSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setRestaurants([]);
    setMenuItems([]);
    setOrders([]);
    setCurrentScreen('landing');
  };

  const loadRestaurants = async () => {
    try {
      const response = await manifest.from('Restaurant').find({ include: ['owner'] });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await manifest.from('MenuItem').find({ include: ['restaurant'] });
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    try {
      // Manifest's 'self' condition handles filtering for the current user
      const response = await manifest.from('Order').find({ include: ['customer', 'items'] });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const createRestaurant = async (restaurantData) => {
    try {
      const newRestaurant = await manifest.from('Restaurant').create(restaurantData);
      setRestaurants([newRestaurant, ...restaurants]);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Could not create restaurant. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${backendConnected ? 'text-gray-700' : 'text-red-600'}`}>
          {backendConnected ? 'API Connected' : 'API Error'}
        </span>
      </div>

      {currentScreen === 'landing' ? (
        <LandingPage onLogin={handleLogin} />
      ) : user ? (
        <DashboardPage
          user={user}
          restaurants={restaurants}
          menuItems={menuItems}
          orders={orders}
          onLogout={handleLogout}
          loadRestaurants={loadRestaurants}
          loadMenuItems={loadMenuItems}
          loadOrders={loadOrders}
          createRestaurant={createRestaurant}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
