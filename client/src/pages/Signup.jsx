import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
      }
      navigate("/sign-in")
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="enter username"
          id="username"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="enter email"
          id="email"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="enter password"
          id="password"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 rounded-sm uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Sign up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-800">something went wrong</p>}
    </div>
  );
}
