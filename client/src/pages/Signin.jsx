import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success === false) {
        dispatch(signInFailure(data));
        return
      }
      
      dispatch(signInSuccess(data))
   navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="enter email"
          id="email"
          className="bg-slate-200 rounded-lg p-3"
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="enter password"
          id="password"
          className="bg-slate-200 rounded-lg p-3"
          onChange={handleChange}
          autoComplete="off"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 rounded-sm uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Sign in"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-3 mt-5">
        <p> Dont have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
     <p className = "text-red-700">{error?error.message||"something went wrong":""}</p>
    </div>
  );
}
