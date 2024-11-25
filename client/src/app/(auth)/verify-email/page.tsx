"use client";
import React, { useEffect } from "react";
import OtpForm from "../../components/auth/OtpForm/OtpForm";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

function page() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    // redirect to login page if user is already verified
    if (user && user._id) {
      router.push("/login");
    }
  }, [user, router]);

  // return null or a loading spinner/indicator
  if (user && user._id) {
    return null;
  }

  return (
    <div className="auth-page w-full h-full flex justify-center items-center">
      <OtpForm />
    </div>
  );
}

export default page;
