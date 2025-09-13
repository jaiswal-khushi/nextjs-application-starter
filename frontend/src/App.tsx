import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import TransferPage from './components/TransferPage';
import ReportPage from './components/ReportPage';
import BalancePage from './components/BalancePage';
import AdminPage from './components/AdminPage';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">SFIT Bank</h1>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="flex justify-between">
            <button
              onClick={handleLogin}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Login
            </button>
            <button
              onClick={() => {
                setUsername('');
                setPassword('');
                setError('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 text-white flex space-x-4">
          <Link to="/transfer" className="hover:underline">Transfer</Link>
          <Link to="/report" className="hover:underline">Report</Link>
          <Link to="/balance" className="hover:underline">Balance</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>
          <button onClick={handleLogout} className="ml-auto bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/transfer" />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
