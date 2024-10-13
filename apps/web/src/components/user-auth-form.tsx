"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeClosedIcon, EyeOpenIcon, CubeIcon } from "@radix-ui/react-icons";
import { authService } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const toast = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const invitationId = searchParams.get("invitationId");
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.authenticate(
        formState.email,
        formState.password
      );
      if (invitationId) {
        router.push(`/invitations/?invitationId=${invitationId}`);
      } else {
        router.push("/dashboard/audience/entities");
      }
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authService.authenticateWithGoogle();
      // The page will be redirected to Google login
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const handleTryDemo = () => {
    setFormState({
      email: "demo@limejourney.com",
      password: "demo@limejourney.com",
    });

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }, 2000);
  };
  return (
    <div className={cn("grid gap-8", className)} {...props}>
      <div className="grid gap-6">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleTryDemo}
          className="rounded-full px-1 py-1 text-sm w-auto"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CubeIcon className="mr-2 h-4 w-4" />
          )}
          Try Demo
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={true}
          onClick={handleGoogleLogin}
          className="rounded-full px-1 py-1 text-sm w-auto"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.colorGoogle className="mr-2 h-4 w-4" />
          )}
          Sign In With Google
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={true}
          className="rounded-full px-1 py-1 text-sm w-auto"
          // onClick={handleGoogleLogin}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          Sign In With Github
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black" />
          </div>
          <div className="relative flex justify-center text-xs uppercas">
            <span className="bg-neutral-200 px-2 text-black">
              Or continue with
            </span>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={formState.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={formState.password}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOpenIcon className="h-4 w-4" />
              ) : (
                <EyeClosedIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <Button className="mt-4" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
}
