"use client";
import React, { useState, useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";
import {
  messagingProfileService,
  MessagingProfile,
  MessagingIntegration,
  MessageLog,
  CreateMessagingProfileInput,
  UpdateMessagingProfileInput,
} from "../../../services/messagingProfileService";

const CredentialInputs: React.FC<{
  integration: MessagingIntegration;
  requiredFields: Record<string, string>;
  credentials: Record<string, string>;
  onRequiredFieldChange: (field: string, value: string) => void;
  onCredentialChange: (field: string, value: string) => void;
}> = ({
  integration,
  requiredFields,
  credentials,
  onRequiredFieldChange,
  onCredentialChange,
}) => {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const handleTogglePassword = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-4">
      {integration.requiredFields.map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-meadow-100">
            {field}
          </Label>
          <Input
            id={field}
            value={requiredFields[field] || ""}
            onChange={(e) => onRequiredFieldChange(field, e.target.value)}
            className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
          />
        </div>
      ))}
      {integration.confidentialFields.map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-meadow-100">
            {field}
          </Label>
          <div className="relative">
            <Input
              id={field}
              type={showPasswords[field] ? "text" : "password"}
              value={credentials[field] || ""}
              onChange={(e) => onCredentialChange(field, e.target.value)}
              className="pr-10 bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-meadow-300 hover:text-meadow-100"
              onClick={() => handleTogglePassword(field)}
            >
              {showPasswords[field] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const MessagingProfilesManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<MessagingProfile[]>([]);
  const [integrations, setIntegrations] = useState<MessagingIntegration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [newProfile, setNewProfile] = useState<CreateMessagingProfileInput>({
    name: "",
    integrationId: "",
    requiredFields: {},
    credentials: {},
    status: "configuring",
  });
  const [editingProfile, setEditingProfile] = useState<MessagingProfile | null>(
    null
  );
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesData, integrationsData] = await Promise.all([
          messagingProfileService.getProfiles(),
          messagingProfileService.getIntegrations(),
        ]);
        setProfiles(profilesData);
        setIntegrations(integrationsData);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description:
            "There was a problem retrieving profiles and integrations.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.integration.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateProfile = (
    profile: CreateMessagingProfileInput | UpdateMessagingProfileInput
  ): string[] => {
    const errors: string[] = [];
    const integration = integrations.find(
      (i) => i.id === profile.integrationId
    );

    if (!integration) {
      errors.push("Invalid integration selected");
      return errors;
    }

    if (!profile.name) {
      errors.push("Profile name is required");
    }

    integration.requiredFields.forEach((field) => {
      if (!profile.requiredFields[field]) {
        errors.push(`${field} is required`);
      }
    });

    integration.confidentialFields.forEach((field) => {
      if (!profile.credentials[field]) {
        errors.push(`${field} is required`);
      }
    });

    return errors;
  };

  const handleAddProfile = async () => {
    const errors = validateProfile(newProfile);
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors.join(", "),
      });
      return;
    }

    try {
      const profileToAdd =
        await messagingProfileService.createProfile(newProfile);
      setProfiles([...profiles, profileToAdd]);
      setIsAddProfileOpen(false);
      setNewProfile({
        name: "",
        integrationId: "",
        requiredFields: {},
        credentials: {},
        status: "configuring",
      });
      toast({
        title: "Profile Added",
        description: "New messaging profile has been created successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error adding profile",
        description: "There was a problem creating the new profile.",
      });
    }
  };

  const handleEditProfile = (profile: MessagingProfile) => {
    setEditingProfile(profile);
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    const errors = validateProfile(editingProfile);
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors.join(", "),
      });
      return;
    }

    try {
      const toUpdate: UpdateMessagingProfileInput = {
        name: editingProfile.name,
        integrationId: editingProfile.integrationId,
        requiredFields: editingProfile.requiredFields,
        credentials: editingProfile.credentials,
        status: editingProfile.status,
      };
      const updatedProfile = await messagingProfileService.updateProfile(
        editingProfile.id,
        toUpdate
      );
      setProfiles(
        profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
      );
      setEditingProfile(null);
      toast({
        title: "Profile Updated",
        description: "Messaging profile has been updated successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "There was a problem updating the profile.",
      });
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    try {
      await messagingProfileService.deleteProfile(profileToDelete);
      setProfiles(profiles.filter((p) => p.id !== profileToDelete));
      setIsDeleteConfirmOpen(false);
      setProfileToDelete(null);
      toast({
        title: "Profile Deleted",
        description: "Messaging profile has been deleted successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error deleting profile",
        description: "There was a problem deleting the profile.",
      });
    }
  };

  const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
      active: { color: "bg-meadow-500", icon: CheckCircle },
      inactive: { color: "bg-red-500", icon: XCircle },
      configuring: { color: "bg-yellow-500", icon: AlertTriangle },
    };
    const { color, icon: Icon } =
      statusConfig[status as keyof typeof statusConfig];

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm font-medium text-meadow-100 capitalize">
          {status}
        </span>
      </div>
    );
  };

  const ProfileLogs: React.FC<{ profile: MessagingProfile }> = ({
    profile,
  }) => {
    const [logs, setLogs] = useState<MessageLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [logsError, setLogsError] = useState<string | null>(null);

    useEffect(() => {
      const fetchLogs = async () => {
        try {
          const fetchedLogs = await messagingProfileService.getProfileLogs(
            profile.id
          );
          setLogs(fetchedLogs);
        } catch (err) {
          setLogsError("Failed to fetch logs. Please try again.");
        } finally {
          setLogsLoading(false);
        }
      };
      fetchLogs();
    }, [profile.id]);

    const filteredLogs = logs.filter(
      (log) =>
        log.event.toLowerCase().includes(logSearchQuery.toLowerCase()) &&
        (logFilter === "all" || log.status === logFilter)
    );

    if (logsLoading) return <div>Loading logs...</div>;
    if (logsError) return <div>Error: {logsError}</div>;

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
                  {new Date(log.createdAt).toLocaleString()}
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

  const ProfileCredentialsDisplay: React.FC<{ profile: MessagingProfile }> = ({
    profile,
  }) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-meadow-300 mb-3">
            Required Fields
          </h3>
          {profile.integration.requiredFields.map((field) => (
            <div
              key={field}
              className="flex justify-between items-center py-2 border-b border-meadow-500/20"
            >
              <span className="text-meadow-300 font-medium">{field}:</span>
              <span className="text-meadow-100">
                {profile.requiredFields[field] || "N/A"}
              </span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-meadow-300 mb-3">
            Confidential Fields
          </h3>
          {profile.integration.confidentialFields.map((field) => (
            <div
              key={field}
              className="flex justify-between items-center py-2 border-b border-meadow-500/20"
            >
              <span className="text-meadow-300 font-medium">{field}:</span>
              <span className="text-meadow-100 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-meadow-500" />
                ********
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-forest-500 min-h-screen text-meadow-100">
      <header className="bg-forest-700 shadow-md">
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
                        setNewProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="integrationId" className="text-meadow-100">
                      Integration
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          integrationId: value,
                          requiredFields: {},
                          credentials: {},
                        }))
                      }
                    >
                      <SelectTrigger className="bg-forest-500 text-meadow-100 border-meadow-500">
                        <SelectValue placeholder="Select integration" />
                      </SelectTrigger>
                      <SelectContent className="bg-forest-600 text-meadow-100 border-meadow-500">
                        {integrations.map((integration) => (
                          <SelectItem
                            key={integration.id}
                            value={integration.id}
                          >
                            {integration.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newProfile.integrationId && (
                    <CredentialInputs
                      integration={
                        integrations.find(
                          (i) => i.id === newProfile.integrationId
                        )!
                      }
                      requiredFields={newProfile.requiredFields}
                      credentials={newProfile.credentials}
                      onRequiredFieldChange={(field, value) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          requiredFields: {
                            ...prev.requiredFields,
                            [field]: value,
                          },
                        }))
                      }
                      onCredentialChange={(field, value) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          credentials: { ...prev.credentials, [field]: value },
                        }))
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

        <Card className="bg-forest-700 border-meadow-500">
          <Table>
            <TableHeader>
              <TableRow className="border-meadow-500 hover:bg-forest-500">
                <TableHead className="text-meadow-100">Name</TableHead>
                <TableHead className="text-meadow-100">Integration</TableHead>
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
                    {profile.integration.name}
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
                            <div className="w-1/2 border-r border-meadow-500/20 p-6 flex flex-col">
                              <SheetHeader className="mb-6">
                                <SheetTitle className="text-meadow-500 text-2xl">
                                  {profile.name}
                                </SheetTitle>
                                <SheetDescription className="text-meadow-100/70">
                                  Messaging profile details and statistics
                                </SheetDescription>
                              </SheetHeader>
                              <ScrollArea className="flex-grow pr-4">
                                <div className="space-y-6">
                                  <Card className="bg-forest-600 border-meadow-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-meadow-300">
                                        Integration
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-meadow-100">
                                        {profile.integration.name}
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
                                        Credentials and Fields
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <ProfileCredentialsDisplay
                                        profile={profile}
                                      />
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
                            <div className="w-1/2 p-6 flex flex-col">
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
                                  <ProfileLogs profile={profile} />
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
                        onClick={() => {
                          setProfileToDelete(profile.id);
                          setIsDeleteConfirmOpen(true);
                        }}
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

      {/* Edit Profile Dialog */}
      <Dialog
        open={!!editingProfile}
        onOpenChange={(open) => !open && setEditingProfile(null)}
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
                    setEditingProfile((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                />
              </div>
              <CredentialInputs
                integration={
                  integrations.find(
                    (i) => i.id === editingProfile.integrationId
                  )!
                }
                requiredFields={editingProfile.requiredFields}
                credentials={editingProfile.credentials}
                onRequiredFieldChange={(field, value) =>
                  setEditingProfile((prev) => ({
                    ...prev!,
                    requiredFields: { ...prev!.requiredFields, [field]: value },
                  }))
                }
                onCredentialChange={(field, value) =>
                  setEditingProfile((prev) => ({
                    ...prev!,
                    credentials: { ...prev!.credentials, [field]: value },
                  }))
                }
              />
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-meadow-100">
                  Status
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProfile((prev) => ({ ...prev!, status: value }))
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-forest-600 border-meadow-500">
          <DialogHeader>
            <DialogTitle className="text-meadow-100">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-meadow-100">
            Are you sure you want to delete this messaging profile? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-forest-500 text-meadow-100 hover:bg-forest-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProfile}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Tooltip */}
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
