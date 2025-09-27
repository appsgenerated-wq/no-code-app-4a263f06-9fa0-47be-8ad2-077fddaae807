import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, restaurants, menuItems, orders, onLogout, loadRestaurants, loadMenuItems, loadOrders, createRestaurant }) => {

  useEffect(() => {
    loadRestaurants();
    loadMenuItems();
    loadOrders();
  }, []); // Load data on component mount

  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: '', cuisine: 'American' });

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    await createRestaurant(newRestaurant);
    setNewRestaurant({ name: '', description: '', address: '', cuisine: 'American' });
  };
  
  const userRestaurants = restaurants.filter(r => r.owner && r.owner.id === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FoodApp Dashboard</h1>
            <p className="text-gray-600">Welcome back, <span className='font-semibold'>{user.name}</span>! ({user.role})</p>
          </div>
          <div>
             <a 
              href={`${config.BACKEND_URL}/admin`} 
              target="_blank"
              rel="noopener noreferrer"
              className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Admin Panel
            </a>
            <button 
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Restaurants and Menu */}
          <div className="lg:col-span-2 space-y-8">
            {user.role === 'owner' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Your Restaurants</h2>
                {userRestaurants.length > 0 ? (
                  <ul className="space-y-2">
                    {userRestaurants.map(r => <li key={r.id} className='p-2 bg-gray-50 rounded'>{r.name}</li>)}
                  </ul>
                ) : (
                  <p className='text-gray-500'>You don't own any restaurants yet.</p>
                )}
                <details className='mt-4'>
                  <summary className='cursor-pointer text-blue-600 hover:underline'>Add a new restaurant</summary>
                  <form onSubmit={handleCreateRestaurant} className="mt-4 space-y-4">
                    <input type="text" placeholder="Restaurant Name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                    <textarea placeholder="Description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} className="w-full p-2 border rounded-md" />
                     <select value={newRestaurant.cuisine} onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} className="w-full p-2 border rounded-md">
                        <option>Italian</option><option>Mexican</option><option>Chinese</option><option>Indian</option><option>American</option>
                     </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Create Restaurant</button>
                  </form>
                </details>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Restaurants</h2>
              {restaurants.length === 0 ? (
                <p className="text-gray-500">No restaurants available right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
                      <p className="text-gray-500 text-xs mt-1">{restaurant.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Menu Items</h2>
              {menuItems.length === 0 ? (
                <p className="text-gray-500">No menu items found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-3 flex flex-col">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className='text-xs text-gray-500 mb-1'>{item.restaurant?.name}</p>
                      <p className="text-gray-600 text-sm flex-grow">{item.description}</p>
                      <div className='flex justify-between items-center mt-2'>
                        <p className="text-green-600 font-bold">${item.price}</p>
                        {user.role === 'customer' && <button className='bg-orange-500 text-white px-3 py-1 text-sm rounded hover:bg-orange-600'>Order</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar: My Orders */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">My Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map(order => (
                    <li key={order.id} className="border-b pb-2">
                      <div className='flex justify-between items-baseline'>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className='text-sm font-medium text-blue-600'>${order.totalPrice}</p>
                      </div>
                      <p className={`text-sm capitalize font-medium ${order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
