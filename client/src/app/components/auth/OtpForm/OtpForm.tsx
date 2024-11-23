"use client";
import React, { useState, FormEvent } from "react";
import { useUserContext } from "@/context/userContext";
import OTPInput from "react-otp-input";
import { ClipLoader } from "react-spinners";

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<string>(""); // State typed as a string
  const { verifyOtp, loading } = useUserContext();

  // Handle OTP input change
  const handleChange = (otpValue: string) => {
    setOtp(otpValue);
  };

  // Handle form submission
  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    verifyOtp(otp); // Assuming verifyOtp accepts a string
  };

  return (
    // Form with OTP input and submit button
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Enter the OTP to verify email
        </h1>
        <OTPInput
          value={otp}
          onChange={handleChange}
          numInputs={6}
          shouldAutoFocus
          inputType="number"
          renderInput={(props) => <input {...props} />}
          containerStyle={{
            display: "flex",
            gap: "1rem",
          }}
          inputStyle={{
            height: "3.0rem",
            width: "3.0rem",
            fontSize: "2rem",
            borderRadius: "5px",
            border: "1px solid #61459E",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          onClick={verifyOtp}
          className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#224d97] text-white rounded-md hover:bg-[#4a86d8] transition-colors"
        >
          {loading ? <ClipLoader color="#ffffff" size={30} /> : "Verify"}
        </button>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
};

export default OtpForm;
