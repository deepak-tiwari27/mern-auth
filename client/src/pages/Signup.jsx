import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="enter username"
          id="username"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
        />
        <input
          type="email"
          placeholder="enter email"
          id="email"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
        />
        <input
          type="password"
          placeholder="enter password"
          id="password"
          className="bg-slate-200 rounded-lg p-3"
          autocomplete="off"
        />
        <button className="bg-slate-700 text-white p-2 rounded-sm uppercase hover:opacity-95 disabled:opacity-80">
          Sign up
        </button>
      </form>
      <div className="flex gap-3 mt-5">
         <p>Have an account? </p>
         <Link to = "/sign-in">
         <span className = "text-blue-500">Sign In</span>
         </Link>
         </div>



    </div>
  );
}
