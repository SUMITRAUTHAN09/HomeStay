"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import URL from "@/constants";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifyOTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || sessionStorage.getItem("resetEmail") || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      // Store reset token
      if (data.resetToken) {
        sessionStorage.setItem("resetToken", data.resetToken);
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);

    } catch (err) {
      console.error("OTP verification error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        setIsLoading(false);
        return;
      }

      alert("OTP resent successfully! Check your email.");
      setOtp("");
      setIsLoading(false);

    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push("/forgot-password")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={200}
              height={200}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify OTP
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 text-sm">OTP verified! Redirecting...</p>
            </div>
          )}

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading || success}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6 || success}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verified!</span>
                </>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}