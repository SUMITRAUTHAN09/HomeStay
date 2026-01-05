"use client";

import URL from "@/app/constant";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-clients";
import { setAdminToken, setAdminEmail } from "@/lib/auth";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import Cookies from 'js-cookie';

// ✅ TypeScript interfaces for type safety
interface LoginResponseData {
  token: string;
  user: {
    email: string;
    id: string;
    name?: string;
    role: string;
  };
}

interface LoginResponse {
  success: boolean;
  data?: LoginResponseData;
  error?: string;
  message?: string;
  statusCode?: number;
}

/* ------------------ Validation Schema ------------------ */
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* ------------------ Formik Setup ------------------ */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.auth.login({
          email: values.email,
          password: values.password,
          rememberMe: false, // Always false - session only
        });

        console.log('🔐 Login response:', response);

        if (response.success && response.data) {
          // ✅ Type-safe access
          const loginData = response.data as LoginResponseData;
          const { token, user } = loginData;
          
          console.log('✅ Login successful, setting tokens...');
          
          // Store in localStorage
          setAdminToken(token);
          setAdminEmail(user.email);

          // ✅ CRITICAL: Set SESSION-ONLY cookie
          // No expires/maxAge = cookie deleted when browser closes
          Cookies.set('adminToken', token, {
            path: '/',           // Available to all routes
            sameSite: 'lax',     // CSRF protection
            secure: false,       // Set to true in production with HTTPS
            // NO expires or maxAge = session cookie!
          });

          console.log('✅ Session cookie set, redirecting to dashboard...');

          // Small delay to ensure cookie is set
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 100);
        } else {
          // ✅ Backend error handling
          console.error('❌ Login failed:', response.error || response.message);
          setError(response.error || response.message || 'Login failed. Please try again.');
        }
      } catch (err: any) {
        // Only true network errors reach here
        console.error('❌ Login network error:', err);
        setError('Unable to connect to server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="flex justify-center mb-2">
              <Image
                src={URL.LOGO}
                alt="Homestay Logo"
                width={200}
                height={200}
                priority
              />
            </div>
          </div>

          <Typography variant="h2" textColor="primary" weight="bold" align="center">
            Welcome To Aamantran
          </Typography>

          <CardDescription className="text-center">
            <Typography variant="muted" textColor="secondary">
              Sign in to manage your Aamantran Home Stay
            </Typography>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <Typography variant="small" className="text-red-700">
                  {error}
                </Typography>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Typography variant="label" weight="semibold">
                  Email Address
                </Typography>
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-11 h-12 border-2"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                <Typography variant="label" weight="semibold">
                  Password
                </Typography>
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 border-2"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7570BC] cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end items-center">
              <button 
                type="button"
                className="text-sm text-[#7570BC] font-semibold cursor-pointer hover:underline"
                onClick={() => router.push('/forgotpassword')}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#7570BC] hover:bg-[#C59594]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Back Home */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => router.push("/")}
              disabled={isLoading}
            >
              <Image
                src={URL.LOGO}
                alt="Homestay Logo"
                width={30}
                height={30}
                priority
              />
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}