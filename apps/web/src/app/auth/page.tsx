"use client";
import Link from "next/link";
import { UserAuthForm } from "@/components/user-auth-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";

export default function AuthenticationPage() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8">
        {invitationId && (
          <Alert className="mb-6 bg-meadow-500 text-forest-900 border-none">
            <AlertTitle>Organization Invitation</AlertTitle>
            <AlertDescription>
              Please sign in or create an account to accept the invitation.
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6 text-center">
          Start Your <span className="text-screaminGreen">Lime Journey</span>
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
                  className="underline underline-offset-4 hover:text-screaminGreen"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-screaminGreen"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
