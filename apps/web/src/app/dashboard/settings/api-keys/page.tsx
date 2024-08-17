"use client";
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Copy, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import LoadingPage from "../../loading";

// Define the type for an API key
interface ApiKey {
  id: number;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

// Mock data for API keys
const mockApiKeys: ApiKey[] = [
  {
    id: 1,
    name: "Production API Key",
    key: "pk_live_51ABCDEFghijklmnop",
    createdAt: "2023-08-15",
    lastUsed: "2023-08-20",
  },
  {
    id: 2,
    name: "Test API Key",
    key: "pk_test_98765432ZYXWVUtsrqpo",
    createdAt: "2023-07-01",
    lastUsed: "2023-08-18",
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApiKeys(mockApiKeys);
    setIsLoading(false);
  };

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    // Simulating API call to generate new key
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newKey: ApiKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      key: `pk_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "-",
    };
    setApiKeys([...apiKeys, newKey]);
    setIsGeneratingKey(false);
    setNewKeyName("");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // You might want to add a toast notification here
  };

  const handleDeleteKey = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    ) {
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">API Keys</h1>

      <Card className="bg-neutral-800 border-neutral-700 mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-white">Your API Keys</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-700 hover:bg-neutral-800">
                <TableHead className="text-neutral-300">Name</TableHead>
                <TableHead className="text-neutral-300">API Key</TableHead>
                <TableHead className="text-neutral-300">Created</TableHead>
                <TableHead className="text-neutral-300">Last Used</TableHead>
                <TableHead className="text-right text-neutral-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow
                  key={apiKey.id}
                  className="border-neutral-700 hover:bg-neutral-700"
                >
                  <TableCell className="text-white">{apiKey.name}</TableCell>
                  <TableCell className="text-white font-mono">
                    {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {apiKey.createdAt}
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {apiKey.lastUsed}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="text-screaminGreen hover:text-screaminGreen/90 hover:bg-neutral-700 mr-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-neutral-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-white">
            Generate New API Key
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-grow">
              <Label htmlFor="new-key-name" className="text-neutral-300">
                API Key Name
              </Label>
              <Input
                id="new-key-name"
                placeholder="e.g., Development API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
              />
            </div>
            <Button
              onClick={handleGenerateKey}
              disabled={isGeneratingKey || !newKeyName}
              className="bg-screaminGreen text-black hover:bg-screaminGreen/90"
            >
              {isGeneratingKey ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Generate New Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-neutral-700 rounded-lg flex items-start">
        <AlertCircle className="text-screaminGreen mr-3 mt-1 flex-shrink-0" />
        <p className="text-neutral-300 text-sm">
          Your API keys carry many privileges, so be sure to keep them secure!
          Do not share your API keys in publicly accessible areas such as
          GitHub, client-side code, and so forth.
        </p>
      </div>
    </div>
  );
}
