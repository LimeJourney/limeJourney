"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  BarChart,
  HelpCircle,
  Info,
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data for messaging providers
const messagingProviders = [
  {
    id: "aws_ses",
    name: "AWS SES",
    type: "email",
    credentials: [
      { name: "accessKeyId", label: "Access Key ID", type: "text" },
      { name: "secretAccessKey", label: "Secret Access Key", type: "password" },
      { name: "region", label: "AWS Region", type: "text" },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    type: "email",
    credentials: [{ name: "apiKey", label: "API Key", type: "password" }],
  },
  {
    id: "twilio",
    name: "Twilio",
    type: "sms",
    credentials: [
      { name: "accountSid", label: "Account SID", type: "text" },
      { name: "authToken", label: "Auth Token", type: "password" },
      { name: "phoneNumber", label: "Twilio Phone Number", type: "text" },
    ],
  },
  {
    id: "firebase_fcm",
    name: "Firebase FCM",
    type: "push",
    credentials: [
      { name: "projectId", label: "Project ID", type: "text" },
      { name: "privateKey", label: "Private Key", type: "password" },
      { name: "clientEmail", label: "Client Email", type: "text" },
    ],
  },
];

// Mock data for messaging profiles
const initialProfiles = [
  {
    id: "1",
    name: "Transactional Emails",
    provider: "aws_ses",
    status: "active",
    credentials: {},
  },
  {
    id: "2",
    name: "Marketing Emails",
    provider: "sendgrid",
    status: "active",
    credentials: {},
  },
  {
    id: "3",
    name: "SMS Notifications",
    provider: "twilio",
    status: "inactive",
    credentials: {},
  },
  {
    id: "4",
    name: "Push Notifications",
    provider: "firebase_fcm",
    status: "configuring",
    credentials: {},
  },
];

const MessagingProfilesManagement = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: "",
    provider: "",
    credentials: {},
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState("all");

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      messagingProviders
        .find((p) => p.id === profile.provider)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAddProfile = () => {
    const profileToAdd = {
      ...newProfile,
      id: (profiles.length + 1).toString(),
      status: "configuring",
    };
    setProfiles([...profiles, profileToAdd]);
    setIsAddProfileOpen(false);
    setNewProfile({ name: "", provider: "", credentials: {} });
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
  };

  const handleUpdateProfile = () => {
    setProfiles(
      profiles.map((p) => (p.id === editingProfile.id ? editingProfile : p))
    );
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles(profiles.filter((p) => p.id !== profileId));
  };

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      active: { color: "bg-meadow-500", icon: CheckCircle },
      inactive: { color: "bg-red-500", icon: XCircle },
      configuring: { color: "bg-yellow-500", icon: AlertTriangle },
    };
    const { color, icon: Icon } = statusConfig[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm font-medium text-meadow-100 capitalize">
          {status}
        </span>
      </div>
    );
  };

  const CredentialInputs = ({ provider, credentials, onChange }) => {
    const [showPasswords, setShowPasswords] = useState({});

    const handleTogglePassword = (credentialName) => {
      setShowPasswords((prev) => ({
        ...prev,
        [credentialName]: !prev[credentialName],
      }));
    };

    return (
      <>
        {messagingProviders
          .find((p) => p.id === provider)
          ?.credentials.map((cred) => (
            <div key={cred.name} className="space-y-2">
              <Label htmlFor={cred.name} className="text-meadow-100">
                {cred.label}
              </Label>
              <div className="relative">
                <Input
                  id={cred.name}
                  type={
                    cred.type === "password" && !showPasswords[cred.name]
                      ? "password"
                      : "text"
                  }
                  value={credentials[cred.name] || ""}
                  onChange={(e) =>
                    onChange({ ...credentials, [cred.name]: e.target.value })
                  }
                  className="pr-10 bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                />
                {cred.type === "password" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-meadow-300 hover:text-meadow-100"
                    onClick={() => handleTogglePassword(cred.name)}
                  >
                    {showPasswords[cred.name] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
      </>
    );
  };

  const ProfileLogs = ({ profile }) => {
    // Mock data for logs
    const logs = [
      {
        id: 1,
        timestamp: "2024-09-01 10:30:15",
        event: "Message sent",
        status: "success",
      },
      {
        id: 2,
        timestamp: "2024-09-01 11:45:22",
        event: "Profile updated",
        status: "info",
      },
      {
        id: 3,
        timestamp: "2024-09-01 14:20:08",
        event: "Failed to send message",
        status: "error",
      },
    ];

    const filteredLogs = logs.filter(
      (log) =>
        log.event.toLowerCase().includes(logSearchQuery.toLowerCase()) &&
        (logFilter === "all" || log.status === logFilter)
    );

    return (
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="border-meadow-500">
              <TableHead className="text-meadow-100">Timestamp</TableHead>
              <TableHead className="text-meadow-100">Event</TableHead>
              <TableHead className="text-meadow-100">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="border-meadow-500">
                <TableCell className="text-meadow-300">
                  {log.timestamp}
                </TableCell>
                <TableCell className="text-meadow-100">{log.event}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.status === "success"
                        ? "success"
                        : log.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                    className={
                      log.status === "success"
                        ? "bg-green-500 text-forest-700"
                        : log.status === "error"
                          ? "bg-red-500 text-forest-700"
                          : "bg-meadow-500 text-forest-700"
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <div className="bg-forest-700 min-h-screen text-meadow-100">
      <header className="bg-forest-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-meadow-100">
              Messaging Profiles
            </h1>
            <Dialog open={isAddProfileOpen} onOpenChange={setIsAddProfileOpen}>
              <DialogTrigger asChild>
                <Button className="bg-meadow-500 text-forest-700 hover:bg-meadow-600">
                  <Plus className="mr-2 h-4 w-4" /> Add Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-forest-600 border-meadow-500">
                <DialogHeader>
                  <DialogTitle className="text-meadow-100">
                    Add New Messaging Profile
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-meadow-100">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newProfile.name}
                      onChange={(e) =>
                        setNewProfile({ ...newProfile, name: e.target.value })
                      }
                      className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-meadow-100">
                      Provider
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewProfile({
                          ...newProfile,
                          provider: value,
                          credentials: {},
                        })
                      }
                    >
                      <SelectTrigger className="bg-forest-500 text-meadow-100 border-meadow-500">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-forest-600 text-meadow-100 border-meadow-500">
                        {messagingProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newProfile.provider && (
                    <CredentialInputs
                      provider={newProfile.provider}
                      credentials={newProfile.credentials}
                      onChange={(credentials) =>
                        setNewProfile({ ...newProfile, credentials })
                      }
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddProfile}
                    className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
                  >
                    Add Profile
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
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-forest-600 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
            />
          </div>
        </div>

        <Card className="bg-forest-600 border-meadow-500">
          <Table>
            <TableHeader>
              <TableRow className="border-meadow-500 hover:bg-forest-500">
                <TableHead className="text-meadow-100">Name</TableHead>
                <TableHead className="text-meadow-100">Provider</TableHead>
                <TableHead className="text-meadow-100">Status</TableHead>
                <TableHead className="text-meadow-100">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="border-meadow-500 hover:bg-forest-500"
                >
                  <TableCell className="font-medium text-meadow-100">
                    {profile.name}
                  </TableCell>
                  <TableCell className="text-meadow-300">
                    {
                      messagingProviders.find((p) => p.id === profile.provider)
                        ?.name
                    }
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={profile.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                          >
                            View
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="right"
                          className="w-full sm:max-w-[1200px] p-0 bg-forest-500"
                        >
                          <div className="flex h-full">
                            {/* Left Panel: Profile Information */}
                            <div className="w-1/3 border-r border-meadow-500/20 p-6 flex flex-col">
                              <SheetHeader className="mb-6">
                                <SheetTitle className="text-meadow-500 text-2xl">
                                  {profile.name}
                                </SheetTitle>
                                <SheetDescription className="text-white/70">
                                  Messaging profile details and statistics
                                </SheetDescription>
                              </SheetHeader>
                              <ScrollArea className="flex-grow pr-4">
                                <div className="space-y-6">
                                  <Card className="bg-forest-600 border-meadow-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-meadow-300">
                                        Provider
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-meadow-100">
                                        {
                                          messagingProviders.find(
                                            (p) => p.id === profile.provider
                                          )?.name
                                        }
                                      </p>
                                    </CardContent>
                                  </Card>

                                  <Card className="bg-forest-600 border-meadow-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-meadow-300">
                                        Status
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <StatusIndicator
                                        status={profile.status}
                                      />
                                    </CardContent>
                                  </Card>

                                  <Card className="bg-forest-600 border-meadow-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-meadow-300">
                                        Credentials
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="flex items-center text-meadow-100">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Securely encrypted and stored
                                      </p>
                                    </CardContent>
                                  </Card>

                                  <Card className="bg-forest-600 border-meadow-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-meadow-300">
                                        Statistics
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-meadow-500">
                                            1,234
                                          </p>
                                          <p className="text-sm text-meadow-300">
                                            Messages Sent
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-meadow-500">
                                            98.7%
                                          </p>
                                          <p className="text-sm text-meadow-300">
                                            Delivery Rate
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-meadow-500">
                                            45ms
                                          </p>
                                          <p className="text-sm text-meadow-300">
                                            Avg. Latency
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </ScrollArea>
                            </div>

                            {/* Right Panel: Logs */}
                            <div className="w-2/3 p-6 flex flex-col">
                              <h3 className="text-xl font-semibold text-meadow-500 mb-4">
                                Recent Logs
                              </h3>
                              <div className="flex justify-between items-center mb-4">
                                <Input
                                  type="text"
                                  placeholder="Search logs..."
                                  value={logSearchQuery}
                                  onChange={(e) =>
                                    setLogSearchQuery(e.target.value)
                                  }
                                  className="w-64 bg-forest-600 text-meadow-100 border-meadow-500/50 focus:border-meadow-500"
                                />
                                <Select
                                  value={logFilter}
                                  onValueChange={setLogFilter}
                                >
                                  <SelectTrigger className="w-40 bg-forest-600 text-meadow-100 border-meadow-500/50">
                                    <SelectValue placeholder="Filter by" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-forest-500 text-meadow-100 border-meadow-500/50">
                                    <SelectItem value="all">
                                      All Events
                                    </SelectItem>
                                    <SelectItem value="error">
                                      Errors
                                    </SelectItem>
                                    <SelectItem value="success">
                                      Successes
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Card className="bg-forest-600 border-meadow-500/20 flex-grow">
                                <CardContent className="p-0">
                                  <ScrollArea className="h-[500px]">
                                    <ProfileLogs profile={profile} />
                                  </ScrollArea>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProfile(profile)}
                        className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {filteredProfiles.length === 0 && (
          <Card className="p-6 text-center bg-forest-600 border-meadow-500 mt-6">
            <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-meadow-100">
              No messaging profiles found
            </h2>
            <p className="text-meadow-300">
              {searchQuery
                ? "No profiles match your search. Try adjusting your search terms."
                : "You haven't added any messaging profiles yet. Click 'Add Profile' to get started."}
            </p>
          </Card>
        )}
      </main>

      <Dialog
        open={!!editingProfile}
        onOpenChange={() => setEditingProfile(null)}
      >
        <DialogContent className="bg-forest-600 border-meadow-500">
          <DialogHeader>
            <DialogTitle className="text-meadow-100">
              Edit Messaging Profile
            </DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-meadow-100">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingProfile.name}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      name: e.target.value,
                    })
                  }
                  className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-provider" className="text-meadow-100">
                  Provider
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProfile({
                      ...editingProfile,
                      provider: value,
                      credentials: {},
                    })
                  }
                  defaultValue={editingProfile.provider}
                >
                  <SelectTrigger className="bg-forest-500 text-meadow-100 border-meadow-500">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-600 text-meadow-100 border-meadow-500">
                    {messagingProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CredentialInputs
                provider={editingProfile.provider}
                credentials={editingProfile.credentials}
                onChange={(credentials) =>
                  setEditingProfile({ ...editingProfile, credentials })
                }
              />
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-meadow-100">
                  Status
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProfile({ ...editingProfile, status: value })
                  }
                  defaultValue={editingProfile.status}
                >
                  <SelectTrigger className="bg-forest-500 text-meadow-100 border-meadow-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-600 text-meadow-100 border-meadow-500">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="configuring">Configuring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleUpdateProfile}
              className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
            >
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-meadow-500 text-forest-700 hover:bg-meadow-600"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-sm bg-forest-600 text-meadow-100 border-meadow-500"
            >
              <p>
                Need help managing your messaging profiles? Click here for a
                quick guide.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MessagingProfilesManagement;
