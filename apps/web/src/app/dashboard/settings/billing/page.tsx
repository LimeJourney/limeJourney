"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  UserPlus,
  CalendarDays,
  ChevronRight,
  Users,
  DownloadCloudIcon,
} from "lucide-react";
import LoadingPage from "../../loading";

// Define types
type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "CANCELLING";

interface Subscription {
  planName: string;
  status: SubscriptionStatus;
  quantity: number;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: number;
  date: string;
  amount: string;
  status: string;
}

// Mock data
const mockSubscription: Subscription = {
  planName: "Pro Plan",
  status: "ACTIVE",
  quantity: 5,
  nextBillingDate: "2023-09-01",
  cancelAtPeriodEnd: false,
};

const mockInvoices: Invoice[] = [
  { id: 1, date: "2023-08-01", amount: "$50.00", status: "Paid" },
  { id: 2, date: "2023-07-01", amount: "$50.00", status: "Paid" },
  { id: 3, date: "2023-06-01", amount: "$40.00", status: "Paid" },
];
export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptionData();
    fetchInvoices();
  }, []);

  const fetchSubscriptionData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscription(mockSubscription);
  };

  const fetchInvoices = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvoices(mockInvoices);
  };

  const handleUpgrade = async () => {
    alert("Redirecting to upgrade page...");
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      setSubscription((prev) =>
        prev ? { ...prev, status: "CANCELLING", cancelAtPeriodEnd: true } : null
      );
      alert(
        "Subscription cancelled. You will have access until the end of the billing period."
      );
    }
  };

  if (!subscription) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Subscription</h1>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 bg-neutral-800 border-neutral-700">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white">Current Plan</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  {subscription.planName}
                </h3>
                <p className="text-neutral-400 mt-1">
                  ${50 * subscription.quantity} per month
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-brightYellow border-brightYellow"
              >
                {subscription.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-neutral-400" />
                <span>{subscription.quantity} seats</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-neutral-400" />
                <span>Renews {subscription.nextBillingDate}</span>
              </div>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <p className="mt-4 text-red-400 font-semibold">
                Your subscription will end on {subscription.nextBillingDate}
              </p>
            )}
          </CardContent>
          <CardFooter className="bg-neutral-800 border-t border-neutral-700 p-4">
            <Button
              onClick={handleUpgrade}
              className="mr-4 bg-brightYellow text-black hover:bg-brightYellow/90"
            >
              Upgrade Plan
            </Button>
            {!subscription.cancelAtPeriodEnd && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-700"
              >
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
          </CardHeader>
          <CardContent className="p-0">
            <button className="w-full p-4 text-left hover:bg-neutral-700 transition-colors duration-200 flex justify-between items-center group">
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5 text-neutral-400" />
                <span className="text-white">Update payment method</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:text-brightYellow transition-colors duration-200" />
            </button>
            <button className="w-full p-4 text-left hover:bg-neutral-700 transition-colors duration-200 flex justify-between items-center group border-t border-neutral-700">
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-neutral-400" />
                <span className="text-white">Manage team members</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:text-brightYellow transition-colors duration-200" />
            </button>
            <button className="w-full p-4 text-left hover:bg-neutral-700 transition-colors duration-200 flex justify-between items-center group border-t border-neutral-700">
              <div className="flex items-center">
                <DownloadCloudIcon className="mr-3 h-5 w-5 text-neutral-400" />
                <span className="text-white">Download All Invoices</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:text-brightYellow transition-colors duration-200" />
            </button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-neutral-800 border-neutral-700">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-white">Billing History</h2>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-700 hover:bg-neutral-800">
                <TableHead className="text-neutral-300">Date</TableHead>
                <TableHead className="text-neutral-300">Amount</TableHead>
                <TableHead className="text-neutral-300">Status</TableHead>
                <TableHead className="text-right text-neutral-300">
                  Invoice
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-neutral-700 hover:bg-neutral-700"
                >
                  <TableCell className="text-white">{invoice.date}</TableCell>
                  <TableCell className="text-white">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid" ? "default" : "secondary"
                      }
                      className="bg-green-400/10 text-green-400"
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="text-brightYellow hover:text-brightYellow/90 hover:bg-neutral-700"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
