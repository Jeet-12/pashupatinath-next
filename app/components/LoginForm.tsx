"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, setSessionToken } from "../libs/api";

interface LoginFormProps {
  email?: string;
  redirectTo?: string;
}

interface LoginErrors {
  email?: string;
  general?: string;
}

export default function LoginForm({ email = "", redirectTo = "" }: LoginFormProps) {
  const [formData, setFormData] = useState({ email });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormData({ email });
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ email: value });
    if (errors.email) setErrors({});
  };

  const validateForm = () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Email is invalid" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loginResponse = await loginUser({ email: formData.email, redirect_to: redirectTo });
      if (loginResponse.success && loginResponse.data?.session_token) {
        setSessionToken(loginResponse.data.session_token);
        router.push(`/verifyOtp?email=${formData.email}&type=login${redirectTo ? `&redirect_to=${redirectTo}` : ""}`);
      } else {
        setErrors({ general: loginResponse.message || "Login failed" });
      }
    } catch (err: any) {
      setErrors({ general: err.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && <div className="text-red-600">{errors.general}</div>}

      <div>
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Sending OTP..." : "Continue with Email"}
      </button>
    </form>
  );
}
