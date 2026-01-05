"use client";

import URL from "@/app/constant";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Get email from URL params or sessionStorage
  const emailFromUrl = searchParams.get('email');
  const emailFromSession = typeof window !== 'undefined' ? sessionStorage.getItem("resetEmail") : null;
  const email = emailFromUrl || emailFromSession || '';

  const isOtpValid = otp.length === 6;

  // ✅ Store email in sessionStorage if it came from URL
  useEffect(() => {
    if (emailFromUrl && typeof window !== 'undefined') {
      sessionStorage.setItem("resetEmail", emailFromUrl);
    }
  }, [emailFromUrl]);

  // ✅ Redirect if no email found
  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      setError("Email not found. Redirecting to forgot password...");
      setTimeout(() => router.push("/forgotpassword"), 2000);
    }
  }, [email, router]);

  const handleVerifyOTP = async () => {
    if (!isOtpValid || !email) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log('🔐 Verifying OTP for:', email);
      
      // ✅ CRITICAL FIX: Verify OTP with backend before proceeding
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email, 
            otp 
          }),
        }
      );

      const data = await response.json();
      console.log('OTP verification response:', data);

      if (!response.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
        setIsLoading(false);
        return;
      }

      // ✅ If backend returns a reset token, store it
      if (data.resetToken) {
        sessionStorage.setItem("resetToken", data.resetToken);
        console.log('✅ Reset token stored');
      }

      // ✅ Store email for reset password page
      sessionStorage.setItem("resetEmail", email);
      
      setSuccess(true);
      console.log('✅ OTP verified successfully! Redirecting...');
      
      setTimeout(() => {
        router.push("/resetpassword");
      }, 1500);

    } catch (err: any) {
      console.error('❌ OTP verification failed:', err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email not found. Please go back to forgot password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log('🔄 Resending OTP to:', email);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/forgot-password`,
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
        setError(data.message || "Failed to resend OTP. Please try again.");
        setIsLoading(false);
        return;
      }
      
      console.log('✅ OTP resent successfully');
      setOtp("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('❌ Resend OTP failed:', err);
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="space-y-4 pb-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={120}
              height={120}
              priority
            />
          </div>

          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
          >
            OTP Verification
          </Typography>

          <Typography variant="paragraph" textColor="secondary" align="center">
            Enter the 6-digit OTP sent to{' '}
            <strong className="text-[#7570BC]">{email || 'your email'}</strong>
          </Typography>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>
                {otp.length === 6 
                  ? "OTP verified successfully! Redirecting..." 
                  : "OTP sent successfully! Check your email."}
              </span>
            </div>
          )}

          <div className="space-y-6 flex flex-col items-center">
            {/* OTP INPUT */}
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError(""); // Clear error on input
              }}
              className="gap-3"
              disabled={isLoading || success}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 text-lg border-2 border-[#BFC7DE] rounded-md focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* VERIFY BUTTON */}
            <Button
              className="w-full h-12 bg-[#7570BC] hover:bg-[#6a66b0] disabled:opacity-50"
              disabled={!isOtpValid || isLoading || !email || success}
              onClick={handleVerifyOTP}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </span>
              ) : success ? (
                'Verified! Redirecting...'
              ) : (
                'Verify OTP'
              )}
            </Button>

            {/* RESEND OTP */}
            <button
              type="button"
              className="text-sm text-[#7570BC] hover:text-[#C59594] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleResendOTP}
              disabled={isLoading || success}
            >
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </button>

            {/* BACK */}
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-[#BFC7DE] text-[#7570BC] hover:bg-[#BFC7DE]/10"
              onClick={() => router.push("/forgotpassword")}
              disabled={isLoading || success}
            >
              Back to Forgot Password
            </Button>
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <Typography variant="small" textColor="secondary">
              OTP is valid for 10 minutes
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}