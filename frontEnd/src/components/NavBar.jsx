import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ user, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg font-bold">CR</div>
          <div>
            <div className="font-bold">Car & Motors</div>
            <div className="text-xs opacity-75">Rentals made easy</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/browse" className="hover:underline">Browse</Link>
          {user?.isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 bg-white text-sky-700 rounded-md font-medium">Sign in</Link>
              <Link to="/register" className="px-3 py-1 border border-white/40 rounded-md">Register</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm">{user.name}</Link>
              <button onClick={onLogout} className="px-3 py-1 bg-white/20 rounded-md">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}