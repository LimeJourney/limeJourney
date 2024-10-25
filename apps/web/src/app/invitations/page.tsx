"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { OrganizationService } from "@/services/organisationService";
import { authService } from "@/services/authService";
import Link from "next/link";
import { Suspense } from "react";

const InvitationAcceptancePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitationDetails, setInvitationDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");

  useEffect(() => {
    const checkAuthAndInvitation = async () => {
      if (!invitationId) {
        setError("No invitation ID provided.");
        setLoading(false);
        return;
      }

      try {
        const authStatus = await authService.isAuthenticated();
        setIsAuthenticated(authStatus);

        if (authStatus) {
          const details =
            await OrganizationService.getInvitationDetails(invitationId);
          setInvitationDetails(details);
        }
      } catch (err) {
        setError("An error occurred while processing your invitation.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndInvitation();
  }, [invitationId]);

  const handleAcceptInvitation = async () => {
    setLoading(true);
    try {
      await OrganizationService.acceptInvitation({
        invitationId: invitationId,
        email: invitationDetails.email,
      });
      router.push("/dashboard/audience/entities");
    } catch (err) {
      setError("Failed to accept invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-forest-500">
        <Loader2 className="w-8 h-8 text-meadow-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-forest-500 p-4">
        <Alert className="bg-red-500 text-white border-none max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-forest-500 p-4">
      <Card className="bg-forest-600 border-meadow-500 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-meadow-500">
            Organization Invitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            invitationDetails ? (
              <>
                <p className="text-white mb-4">
                  You've been invited to join{" "}
                  {invitationDetails.organizationName}.
                </p>
                <Button
                  className="bg-meadow-500 text-forest-500 hover:bg-meadow-600 w-full"
                  onClick={handleAcceptInvitation}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Accept Invitation
                </Button>
              </>
            ) : (
              <p className="text-white">
                Unable to fetch invitation details. Please try again.
              </p>
            )
          ) : (
            <div>
              <p className="text-white mb-4">
                Please sign in or create an account to view and accept this
                invitation.
              </p>
              <Link href={`/auth?invitationId=${invitationId}`} passHref>
                <Button className="bg-meadow-500 text-forest-500 hover:bg-meadow-600 w-full">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationAcceptancePage;
