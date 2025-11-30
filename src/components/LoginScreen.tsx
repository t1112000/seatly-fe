import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../services/auth/auth.api";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        onLogin();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to login";
        setAuthError(message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      setAuthError(
        errorResponse?.error_description || "Google authentication failed"
      );
      setIsLoading(false);
    },
  });

  const handleGoogleSignIn = () => {
    setAuthError(null);
    setIsLoading(true);
    googleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl text-white tracking-tight mb-2">Seatly</h1>
          <p className="text-slate-400">Book your perfect seat</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1A2235] rounded-2xl p-8 shadow-2xl border border-slate-800">
          <h2 className="text-2xl text-white mb-2 text-center">Welcome back</h2>
          <p className="text-slate-400 text-center mb-8">
            Sign in to continue booking
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed text-gray-900 py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.8055 10.2292C19.8055 9.55136 19.7501 8.86932 19.6319 8.20117H10.2002V12.0492H15.6014C15.3775 13.2911 14.6573 14.3898 13.6025 15.0877V17.5866H16.825C18.7174 15.8449 19.8055 13.2728 19.8055 10.2292Z"
                fill="#4285F4"
              />
              <path
                d="M10.2002 20.0006C12.9508 20.0006 15.2711 19.1151 16.8287 17.5865L13.6062 15.0876C12.7096 15.6979 11.5509 16.0433 10.2039 16.0433C7.54353 16.0433 5.28174 14.2834 4.48741 11.917H1.16699V14.4927C2.75985 17.8695 6.32055 20.0006 10.2002 20.0006Z"
                fill="#34A853"
              />
              <path
                d="M4.48372 11.917C4.04544 10.6751 4.04544 9.32932 4.48372 8.08742V5.51172H1.16699C-0.388996 8.71667 -0.388996 12.2878 1.16699 15.4927L4.48372 11.917Z"
                fill="#FBBC04"
              />
              <path
                d="M10.2002 3.95738C11.6249 3.93595 13.002 4.4724 14.0421 5.45979L16.8914 2.60213C15.1858 0.991085 12.9323 0.0941419 10.2002 0.11978C6.32055 0.11978 2.75985 2.25093 1.16699 5.51174L4.48372 8.08744C5.27435 5.71675 7.53984 3.95738 10.2002 3.95738Z"
                fill="#EA4335"
              />
            </svg>
            <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
          </button>

          {authError && (
            <div className="mt-4 text-center text-sm text-red-500 text-white">
              {authError}
            </div>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            By continuing, you agree to our Terms of Service
          </div>
        </div>
      </div>
    </div>
  );
}
