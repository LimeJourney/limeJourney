"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  BarChart2,
  MessageSquare,
  ArrowRight,
  Activity,
  Users,
  Calendar,
  Zap,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  aiInsightsService,
  InsightQuery,
  InsightResponse,
  RecentQuery,
  OrganizationInsights,
} from "@/services/insightService";

interface EventData {
  name: string;
  count: number;
}

const AIInsightsPage: React.FC = () => {
  const [aiQuery, setAIQuery] = useState<string>("");
  const [insightResponse, setInsightResponse] =
    useState<InsightResponse | null>(null);
  const [organizationInsights, setOrganizationInsights] =
    useState<OrganizationInsights | null>(null);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sample queries to suggest when there are no recent queries
  const sampleQueries: string[] = [
    "What's our user growth rate this month?",
    "Which product has the highest engagement?",
    "What's the average session duration for premium users?",
    "How many support tickets were resolved last week?",
  ];

  useEffect(() => {
    fetchOrganizationInsights();
    fetchRecentQueries();
  }, []);

  const fetchOrganizationInsights = async (): Promise<void> => {
    try {
      const data = await aiInsightsService.getOrganizationInsights();
      setOrganizationInsights(data);
    } catch (error) {
      console.error("Error fetching organization insights:", error);
    }
  };

  const fetchRecentQueries = async (): Promise<void> => {
    try {
      const data = await aiInsightsService.getRecentQueries();
      setRecentQueries(data);
    } catch (error) {
      console.error("Error fetching recent queries:", error);
    }
  };

  const handleAskAI = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const queryData: InsightQuery = { query: aiQuery };
      const response = await aiInsightsService.getInsights(queryData);
      setInsightResponse(response);
      setAIQuery("");
      fetchRecentQueries(); // Refresh recent queries after a new query
    } catch (error) {
      console.error("Error querying AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousQuery = (query: RecentQuery): void => {
    setAIQuery(query.query);
    setInsightResponse({ insight: query.response, confidence: 1 }); // Assuming confidence is not stored for previous queries
  };

  const eventData: EventData[] = organizationInsights
    ? Object.entries(organizationInsights.uniqueEvents).map(
        ([name, count]) => ({
          name,
          count,
        })
      )
    : [];

  return (
    <div className="px-8 py-6 bg-forest-500 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Insights & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-forest-600 border-meadow-500">
            <CardHeader>
              <CardTitle className="text-meadow-500 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Event Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A202C",
                      border: "none",
                    }}
                    labelStyle={{ color: "#A0AEC0" }}
                  />
                  <Bar dataKey="count" fill="#48BB78" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-forest-600 border-meadow-500">
            <CardHeader>
              <CardTitle className="text-meadow-500 flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Total Entities</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-meadow-500" />
                    {organizationInsights?.totalEntities || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Active Users (Last 30 days)
                  </p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-meadow-500" />
                    {organizationInsights?.activeEntitiesLast30Days || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-meadow-500" />
                    {organizationInsights?.totalEvents || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Events per User</p>
                  <p className="text-2xl font-bold text-white flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-meadow-500" />
                    {organizationInsights?.averageEventsPerEntity || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-6 bg-forest-600 border-meadow-500">
          <CardHeader>
            <CardTitle className="text-meadow-500 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              AI Query
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={aiQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAIQuery(e.target.value)
                }
                placeholder="Ask a question about your data..."
                className="flex-grow bg-forest-700 text-white border-meadow-500 focus:ring-meadow-500 focus:border-meadow-500"
              />
              <Button
                className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
                onClick={handleAskAI}
                disabled={isLoading}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {isLoading ? "Loading..." : "Ask AI"}
              </Button>
            </div>
            {insightResponse && (
              <Alert className="bg-meadow-500 text-forest-900 border-none">
                <AlertTitle className="text-lg font-semibold mb-2">
                  AI Response
                </AlertTitle>
                <AlertDescription>
                  <p className="text-forest-800">{insightResponse.insight}</p>
                  <p className="text-sm mt-2">
                    Confidence: {(insightResponse.confidence * 100).toFixed(2)}%
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <Card className="bg-forest-600 border-meadow-500">
          <CardHeader>
            <CardTitle className="text-meadow-500 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Previous Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQueries.length > 0 ? (
              <ul className="space-y-2">
                {recentQueries.map((query, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-forest-700 rounded"
                  >
                    <span className="text-white">{query.query}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                      onClick={() => handlePreviousQuery(query)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 mb-4">
                  No previous queries yet. Try asking something!
                </p>
                <p className="text-meadow-500 mb-2">
                  Here are some suggestions to get you started:
                </p>
                <ul className="space-y-2">
                  {sampleQueries.map((query, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-forest-700 rounded"
                    >
                      <span className="text-white">{query}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                        onClick={() => setAIQuery(query)}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsightsPage;
