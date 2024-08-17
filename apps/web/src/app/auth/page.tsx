import Link from "next/link";
import { UserAuthForm } from "@/components/user-auth-form";
export const metadata = {
  title: "Authentication",
  description: "Sign in to your Lime Journey account",
};

export default function AuthenticationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8">
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
  );
}
