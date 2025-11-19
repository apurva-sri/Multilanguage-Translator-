import React from "react";
import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">Transly</div>
        <div className="text-sm text-gray-500">Multi-language translator</div>
      </div>

      <nav className="flex items-center gap-4">
        <Link to="/" className="text-sm">
          Home
        </Link>
        {!user ? (
          <>
            <Link to="/login" className="text-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <button onClick={onLogout} className="text-sm text-red-500">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
