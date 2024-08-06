"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserAuthForm } from "@/components/user-auth-form";
import { authService } from "@/services/authService";

export default function AuthenticationPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = authService.getToken();
      if (token) {
        router.push("/dashboard");
      }
    };

    checkAuthToken();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6 text-center">
        Start Your <span className="text-brightYellow">Lime Journey</span>
      </h1>
      <div className="w-full max-w-md bg-neutral-200 rounded-lg shadow-xl overflow-hidden text-black">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-gray-600">
                Enter Your Credentials Below To Get Started
              </p>
            </div>
            <UserAuthForm />
            <p className="text-center text-xs text-gray-700">
              By clicking sign in, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-brightYellow"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-brightYellow"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
