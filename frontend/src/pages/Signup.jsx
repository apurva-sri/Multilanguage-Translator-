import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", { name, email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
