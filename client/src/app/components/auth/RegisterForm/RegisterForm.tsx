"use client";
import { useUserContext } from "@/context/userContext";
import React from "react";

function RegisterForm() {
  const { registerUser, userState, handlerUserInput } = useUserContext();
  const { name, email, password, confirmPassword } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an account. Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-[#224d97] hover:text-[#7263F3] transition-all duration-300"
          >
            Login here
          </a>
        </p>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-[#999]">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => handlerUserInput("name")(e)}
            name="name"
            className="px-4 py-3 border-[2px] rounded-md outline-[#224d97] text-gray-800"
            placeholder="John Doe"
          />
        </div>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => handlerUserInput("email")(e)}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#224d97] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => handlerUserInput("password")(e)}
            name="password"
            className="px-4 py-3 border-[2px] rounded-md outline-[#224d97] text-gray-800"
            placeholder="***************"
          />

          <button
            type="button"
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          >
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>

        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="confirmpassword" className="mb-1 text-[#999]">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "confirmPassword"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handlerUserInput("confirmPassword")(e)}
            name="confirmPassword"
            className="px-4 py-3 border-[2px] rounded-md outline-[#224d97] text-gray-800"
            placeholder="***************"
          />

          <button
            type="button"
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          >
            {showConfirmPassword ? (
              <i
                className="fas fa-eye-slash"
                onClick={toggleConfirmPassword}
              ></i>
            ) : (
              <i className="fas fa-eye" onClick={toggleConfirmPassword}></i>
            )}
          </button>
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={!name || !email || !password || !confirmPassword}
            onClick={registerUser}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#224d97] text-white rounded-md hover:bg-[#4a86d8] transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
}

export default RegisterForm;
