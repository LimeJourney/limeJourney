"use client";
import React, { useState } from "react";
import { Search, BarChart2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AIInsightsPage = () => {
  const [aiQuery, setAIQuery] = useState("");

  const eventData = [
    { name: "Login", count: 1200 },
    { name: "Purchase", count: 450 },
    { name: "Page View", count: 2800 },
    { name: "Support Request", count: 180 },
  ];

  const previousQueries = [
    "What's the average session duration for premium users?",
    "Which product category has the highest conversion rate?",
    "How many new sign-ups did we get last week compared to the previous week?",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Insights & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Entities</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Active Users (Last 30 days)
                </p>
                <p className="text-2xl font-bold">987</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">45,678</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Events per User</p>
                <p className="text-2xl font-bold">37</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Query</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={aiQuery}
              onChange={(e) => setAIQuery(e.target.value)}
              placeholder="Ask a question about your data..."
              className="flex-grow"
            />
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" /> Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {previousQueries.map((query, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{query}</span>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPage;
