"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Send,
  Mail,
  Bell,
  SortAsc,
  SortDesc,
  LayoutGrid,
  List,
  Save,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { entityService } from "@/services/entitiesService";
import EmailTemplateEditor from "./components/editor";
import {
  templateService,
  Template,
  ChannelType,
  TemplateStatus,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/services/templateService";
import {
  messagingProfileService,
  MessagingProfile,
} from "@/services/messagingProfileService";

const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const [currentTemplate, setCurrentTemplate] = useState<
    CreateTemplateInput & { id?: string }
  >({
    name: "",
    channel: ChannelType.EMAIL,
    subjectLine: "",
    previewText: "",
    content: "",
    tags: [],
    status: TemplateStatus.DRAFT,
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<keyof Template>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterChannel, setFilterChannel] = useState<ChannelType | "all">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<TemplateStatus | "all">(
    "all"
  );
  const [tagSuggestions] = useState<string[]>([
    "promotional",
    "transactional",
    "newsletter",
    "welcome",
    "reminder",
  ]);
  const [selectedProfile, setSelectedProfile] =
    useState<MessagingProfile | null>(null);
  const [profiles, setProfiles] = useState<MessagingProfile[]>([]);
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates();
    fetchPlaceholders();
    fetchProfiles();
  }, []);

  const fetchTemplates = async () => {
    try {
      const fetchedTemplates = await templateService.getTemplates({
        channel: filterChannel !== "all" ? filterChannel : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        // search: searchQuery,
      });
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchPlaceholders = async () => {
    try {
      const response = await entityService.getEntityProperties();
      setPlaceholders(response);
    } catch (error) {
      console.error("Error fetching placeholders:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const fetchedProfiles = await messagingProfileService.getProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching messaging profiles:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filterChannel, filterStatus, searchQuery]);

  const handleSaveTemplate = async () => {
    try {
      if (!selectedProfile) {
        console.error("No messaging profile selected");
        return;
      }

      const templateData = {
        ...currentTemplate,
        messagingProfileId: selectedProfile.id,
      };

      if (currentTemplate.id) {
        const { id, ...updateData } = templateData;
        await templateService.updateTemplate(
          id as string,
          updateData as UpdateTemplateInput
        );
      } else {
        await templateService.createTemplate(
          templateData as CreateTemplateInput
        );
      }
      setIsTemplateSheetOpen(false);
      fetchTemplates();
      resetCurrentTemplate();
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const getChannelFromIntegrationType = (
    integrationType: string
  ): ChannelType => {
    switch (integrationType.toLowerCase()) {
      case "email":
        return ChannelType.EMAIL;
      case "sms":
        return ChannelType.SMS;
      default:
        return ChannelType.PUSH;
    }
  };

  const resetCurrentTemplate = () => {
    setCurrentTemplate({
      name: "",
      channel: ChannelType.EMAIL,
      subjectLine: "",
      previewText: "",
      content: "",
      tags: [],
      status: TemplateStatus.DRAFT,
    });
    setSelectedProfile(null);
  };

  const handleDeleteTemplate = (template: Template) => {
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        await templateService.deleteTemplate(templateToDelete.id);
        setIsDeleteDialogOpen(false);
        setTemplateToDelete(null);
        fetchTemplates();
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const handleDuplicateTemplate = async (template: Template) => {
    try {
      await templateService.duplicateTemplate(template.id);
      fetchTemplates();
    } catch (error) {
      console.error("Error duplicating template:", error);
    }
  };

  const handleSendTestMessage = (template: Template) => {
    console.log(
      `Sending test ${template.channel} for template: ${template.name}`
    );
    // Implement test message sending logic here
  };

  const filteredAndSortedTemplates = templates.sort((a, b) => {
    const aValue = String(a[sortBy] ?? "");
    const bValue = String(b[sortBy] ?? "");
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleProfileSelect = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
      setCurrentTemplate((prev) => ({
        ...prev,
        channel: getChannelFromIntegrationType(profile.integration.type),
      }));
    }
  };

  const TemplateGrid: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {filteredAndSortedTemplates.map((template) => (
        <motion.div
          key={template.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-forest-600 border-meadow-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {template.name}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-forest-500 text-meadow-500 border-meadow-500"
                >
                  {template.channel === ChannelType.EMAIL ? (
                    <Mail className="mr-2 h-4 w-4" />
                  ) : template.channel === ChannelType.PUSH ? (
                    <Bell className="mr-2 h-4 w-4" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  {template.channel}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4 truncate">
                {template.channel === ChannelType.EMAIL
                  ? template.subjectLine
                  : template.content}
              </p>
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={`${
                    template.status === TemplateStatus.ACTIVE
                      ? "bg-green-900 text-green-300 border-green-500"
                      : template.status === TemplateStatus.ARCHIVED
                        ? "bg-gray-900 text-gray-300 border-gray-500"
                        : "bg-yellow-900 text-yellow-300 border-yellow-500"
                  }`}
                >
                  {template.status}
                </Badge>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentTemplate(template);
                            setIsTemplateSheetOpen(true);
                          }}
                          className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-forest-500 text-white">
                        <p>Edit template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-forest-500 text-white">
                        <p>Delete template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateTemplate(template)}
                          className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-forest-500 text-white">
                        <p>Duplicate template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendTestMessage(template)}
                          className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-forest-500 text-white">
                        <p>Send test message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="px-8 py-6 bg-forest-500 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Message Templates</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-forest-600 text-white border-meadow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => {
                resetCurrentTemplate();
                setIsTemplateSheetOpen(true);
              }}
              className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <Select
              value={filterChannel}
              onValueChange={(value) =>
                setFilterChannel(value as ChannelType | "all")
              }
            >
              <SelectTrigger className="bg-forest-600 text-white border-meadow-500">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent className="bg-forest-600 text-white">
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value={ChannelType.EMAIL}>Email</SelectItem>
                <SelectItem value={ChannelType.PUSH}>
                  Push Notification
                </SelectItem>
                <SelectItem value={ChannelType.SMS}>SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as TemplateStatus | "all")
              }
            >
              <SelectTrigger className="bg-forest-600 text-white border-meadow-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-forest-600 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TemplateStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={TemplateStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={TemplateStatus.ARCHIVED}>
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as keyof Template);
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              <SelectTrigger className="bg-forest-600 text-white border-meadow-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-forest-600 text-white">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="channel">Channel</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
            >
              {viewMode === "list" ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-forest-600 border-meadow-500">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-forest-700 border-meadow-500">
                      <TableHead className="text-meadow-500">Name</TableHead>
                      <TableHead className="text-meadow-500">Channel</TableHead>
                      <TableHead className="text-meadow-500">
                        Subject/Content
                      </TableHead>
                      <TableHead className="text-meadow-500">Status</TableHead>
                      <TableHead className="text-meadow-500">
                        Last Updated
                      </TableHead>
                      <TableHead className="text-meadow-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTemplates.map((template) => (
                      <TableRow
                        key={template.id}
                        className="hover:bg-forest-700 border-meadow-500"
                      >
                        <TableCell className="font-medium text-white">
                          {template.name}
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge
                            variant="outline"
                            className="bg-forest-500 text-meadow-500 border-meadow-500"
                          >
                            {template.channel === ChannelType.EMAIL ? (
                              <Mail className="mr-2 h-4 w-4" />
                            ) : template.channel === ChannelType.PUSH ? (
                              <Bell className="mr-2 h-4 w-4" />
                            ) : (
                              <MessageSquare className="mr-2 h-4 w-4" />
                            )}
                            {template.channel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {template.channel === ChannelType.EMAIL
                            ? template.subjectLine
                            : template.content}
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge
                            variant="outline"
                            className={`${
                              template.status === TemplateStatus.ACTIVE
                                ? "bg-green-900 text-green-300 border-green-500"
                                : template.status === TemplateStatus.ARCHIVED
                                  ? "bg-gray-900 text-gray-300 border-gray-500"
                                  : "bg-yellow-900 text-yellow-300 border-yellow-500"
                            }`}
                          >
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(template.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setCurrentTemplate(template);
                                      setIsTemplateSheetOpen(true);
                                    }}
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-forest-500 text-white">
                                  <p>Edit template</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteTemplate(template)
                                    }
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-forest-500 text-white">
                                  <p>Delete template</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDuplicateTemplate(template)
                                    }
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-forest-500 text-white">
                                  <p>Duplicate template</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleSendTestMessage(template)
                                    }
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-forest-500 text-white">
                                  <p>Send test message</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          ) : (
            <TemplateGrid />
          )}
        </AnimatePresence>

        <Sheet open={isTemplateSheetOpen} onOpenChange={setIsTemplateSheetOpen}>
          <SheetContent
            className={`w-full sm:max-w-[1200px] p-0 bg-forest-700`}
            side="right"
          >
            <SheetHeader className="p-6 border-b border-meadow-500">
              <SheetTitle className="text-meadow-500 text-2xl">
                {currentTemplate.id ? "Edit Template" : "Create New Template"}
              </SheetTitle>
              <SheetDescription className="text-forest-300">
                Design your message template and preview it in real-time
              </SheetDescription>
            </SheetHeader>
            <div className={`h-[calc(100vh-200px)]`}>
              <EmailTemplateEditor
                currentTemplate={currentTemplate}
                setCurrentTemplate={setCurrentTemplate}
                selectedProfile={selectedProfile}
                onProfileSelect={handleProfileSelect}
                profiles={profiles}
                placeholders={placeholders}
                tagSuggestions={tagSuggestions}
              />
            </div>
            <SheetFooter className="p-6 border-t border-forest-500">
              <div className="flex justify-between items-center w-full">
                <Button
                  onClick={() => setIsTemplateSheetOpen(false)}
                  variant="outline"
                  className="mr-2 border-meadow-500 bg-forest-600 text-meadow-500 hover:bg-forest-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {currentTemplate.id ? "Update Template" : "Create Template"}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-forest-500 text-white">
            <DialogHeader>
              <DialogTitle className="text-meadow-500">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to delete the template "
                {templateToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteTemplate}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TemplateManagement;
