"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Copy,
  Key,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { apiKeyService, ApiKey } from "../../../../services/apiKeyService";

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const keys = await apiKeyService.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching API keys",
        description: "There was a problem retrieving your API keys.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const newKey = await apiKeyService.generateApiKey({ name: newKeyName });
      setApiKeys([...apiKeys, newKey]);
      setIsAddKeyOpen(false);
      setNewKeyName("");
      toast({
        title: "API Key Generated",
        description: "Your new API key has been created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating API key",
        description: "There was a problem creating your API key.",
      });
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleDeleteKey = async () => {
    if (!keyToDelete) return;

    try {
      await apiKeyService.deleteApiKey(keyToDelete);
      setApiKeys(apiKeys.filter((k) => k.id !== keyToDelete));
      setIsDeleteConfirmOpen(false);
      setKeyToDelete(null);
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting API key",
        description: "There was a problem deleting the API key.",
      });
    }
  };

  const filteredKeys = apiKeys.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-forest-500">
        <RefreshCw className="h-8 w-8 text-meadow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-forest-500 min-h-screen text-meadow-100">
      <header className="bg-forest-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-meadow-100">API Keys</h1>
            <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-meadow-500 text-forest-700 hover:bg-meadow-600">
                  <Plus className="mr-2 h-4 w-4" /> Generate New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-forest-600 border-meadow-500">
                <DialogHeader>
                  <DialogTitle className="text-meadow-100">
                    Generate New API Key
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-meadow-100">
                      API Key Name
                    </Label>
                    <Input
                      id="name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API Key"
                      className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleGenerateKey}
                    disabled={!newKeyName}
                    className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
                  >
                    Generate Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-meadow-300" />
            <Input
              type="text"
              placeholder="Search API keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-forest-600 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
            />
          </div>
        </div>

        <Card className="bg-forest-700 border-meadow-500">
          <Table>
            <TableHeader>
              <TableRow className="border-meadow-500">
                <TableHead className="text-meadow-100">Name</TableHead>
                <TableHead className="text-meadow-100">API Key</TableHead>
                <TableHead className="text-meadow-100">Created</TableHead>
                <TableHead className="text-meadow-100">Last Used</TableHead>
                <TableHead className="text-meadow-100 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((apiKey) => (
                <TableRow
                  key={apiKey.id}
                  className="border-meadow-500 hover:bg-forest-500"
                >
                  <TableCell className="font-medium text-meadow-100">
                    {apiKey.name}
                  </TableCell>
                  <TableCell className="font-mono text-meadow-300">
                    <span className="flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>
                        {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-meadow-300">
                    {new Date(apiKey.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-meadow-300">
                    {apiKey.last_used_at
                      ? new Date(apiKey.last_used_at).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500 mr-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setKeyToDelete(apiKey.id);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {filteredKeys.length === 0 && (
          <Card className="p-6 text-center bg-forest-600 border-meadow-500 mt-6">
            <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-meadow-100">
              No API keys found
            </h2>
            <p className="text-meadow-300">
              {searchQuery
                ? "No API keys match your search. Try adjusting your search terms."
                : "You haven't generated any API keys yet. Click 'Generate New Key' to get started."}
            </p>
          </Card>
        )}

        <Card className="mt-8 bg-forest-600 border-meadow-500">
          <CardHeader>
            <CardTitle className="text-meadow-100 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-meadow-500" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-meadow-300">
              Your API keys carry many privileges, so be sure to keep them
              secure! Do not share your API keys in publicly accessible areas
              such as GitHub, client-side code, and so forth.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-forest-600 border-meadow-500">
          <DialogHeader>
            <DialogTitle className="text-meadow-100">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-meadow-100">
            Are you sure you want to delete this API key? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-forest-500 text-meadow-100 hover:bg-forest-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteKey}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
