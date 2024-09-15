"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
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
  ChevronDown,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Filter,
  SortAsc,
  SortDesc,
  LayoutGrid,
  List,
  X,
  ArrowLeft,
  ArrowRight,
  Save,
  Tag,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "Welcome Email",
      channel: "email",
      subjectLine: "Welcome to our platform!",
      previewText: "We're excited to have you on board.",
      content:
        "<h1>Welcome, {{first_name}}!</h1><p>We're thrilled to have you join our platform.</p>",
      status: "active",
      tags: ["welcome", "onboarding"],
      createdAt: "2023-09-01T00:00:00Z",
      updatedAt: "2023-09-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Order Confirmation",
      channel: "email",
      subjectLine: "Your order is confirmed",
      previewText: "Thank you for your purchase. Here are your order details.",
      content:
        "<h2>Order Confirmation</h2><p>Dear {{first_name}},</p><p>Thank you for your purchase. Your order #{{order_number}} has been confirmed.</p>",
      status: "active",
      tags: ["transactional", "order"],
      createdAt: "2023-09-02T00:00:00Z",
      updatedAt: "2023-09-02T00:00:00Z",
    },
    {
      id: "3",
      name: "New Product Alert",
      channel: "push",
      content: "Check out our latest product: The Ultimate Gadget! 🚀",
      status: "draft",
      tags: ["promotional", "product"],
      createdAt: "2023-09-03T00:00:00Z",
      updatedAt: "2023-09-03T00:00:00Z",
    },
    {
      id: "4",
      name: "Flash Sale Notification",
      channel: "push",
      content: "24-hour Flash Sale! 50% off all items. Shop now! 🛍️",
      status: "active",
      tags: ["promotional", "sale"],
      createdAt: "2023-09-04T00:00:00Z",
      updatedAt: "2023-09-04T00:00:00Z",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState({
    id: "",
    name: "",
    channel: "email",
    subjectLine: "",
    previewText: "",
    content: "",
    tags: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSource, setShowSource] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentStep, setCurrentStep] = useState(0);
  const [tagSuggestions] = useState([
    "promotional",
    "transactional",
    "newsletter",
    "welcome",
    "reminder",
  ]);

  const filteredAndSortedTemplates = templates
    .filter(
      (template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.channel.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (template) =>
        filterChannel === "all" || template.channel === filterChannel
    )
    .filter(
      (template) => filterStatus === "all" || template.status === filterStatus
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSaveTemplate = () => {
    const now = new Date().toISOString();
    if (currentTemplate.id) {
      setTemplates(
        templates.map((t) =>
          t.id === currentTemplate.id
            ? { ...currentTemplate, updatedAt: now }
            : t
        )
      );
    } else {
      const newTemplate = {
        ...currentTemplate,
        id: (templates.length + 1).toString(),
        createdAt: now,
        updatedAt: now,
      };
      setTemplates([...templates, newTemplate]);
    }
    setIsTemplateSheetOpen(false);
    resetCurrentTemplate();
  };

  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = () => {
    setTemplates(templates.filter((t) => t.id !== templateToDelete.id));
    setIsDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const resetCurrentTemplate = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      channel: "email",
      subjectLine: "",
      previewText: "",
      content: "",
      tags: [],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: (templates.length + 1).toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleSendTestMessage = (template) => {
    console.log(
      `Sending test ${template.channel} for template: ${template.name}`
    );
  };

  const steps = ["Design", "Settings", "Preview"];

  const TemplateEditor = () => (
    <div className="space-y-6">
      <Input
        placeholder="Template Name"
        value={currentTemplate.name}
        onChange={(e) =>
          setCurrentTemplate({ ...currentTemplate, name: e.target.value })
        }
        className="bg-forest-500 text-white border-meadow-500 placeholder-gray-400"
      />
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="channel" className="text-forest-500">
            Channel
          </Label>
          <Select
            id="channel"
            value={currentTemplate.channel}
            onValueChange={(value) =>
              setCurrentTemplate({ ...currentTemplate, channel: value })
            }
          >
            <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent className="bg-forest-500 text-white">
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label htmlFor="status" className="text-forest-500">
            Status
          </Label>
          <Select
            id="status"
            value={currentTemplate.status}
            onValueChange={(value) =>
              setCurrentTemplate({ ...currentTemplate, status: value })
            }
          >
            <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-forest-500 text-white">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {currentTemplate.channel === "email" && (
        <>
          <Input
            placeholder="Subject Line"
            value={currentTemplate.subjectLine}
            onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                subjectLine: e.target.value,
              })
            }
            className="bg-forest-500 text-white border-meadow-500 placeholder-gray-400"
          />
          <Input
            placeholder="Preview Text"
            value={currentTemplate.previewText}
            onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                previewText: e.target.value,
              })
            }
            className="bg-forest-500 text-white border-meadow-500 placeholder-gray-400"
          />
        </>
      )}
      <div className="border rounded-md border-meadow-500">
        <ReactQuill
          theme="snow"
          value={currentTemplate.content}
          onChange={(content) =>
            setCurrentTemplate({ ...currentTemplate, content })
          }
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          className="bg-forest-500 text-white"
        />
      </div>
    </div>
  );

  const TemplateSettings = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="tags" className="text-forest-500">
          Tags
        </Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {currentTemplate.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-forest-500 text-meadow-500"
            >
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 p-0 h-auto text-meadow-500 hover:text-meadow-400"
                onClick={() => {
                  const newTags = [...currentTemplate.tags];
                  newTags.splice(index, 1);
                  setCurrentTemplate({ ...currentTemplate, tags: newTags });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-forest-500 border-forest-500"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-meadow-500 border-forest-500">
              <ScrollArea className="h-64">
                {tagSuggestions.map((tag) => (
                  <Button
                    key={tag}
                    variant="ghost"
                    className="w-full justify-start text-forest-500 hover:bg-meadow-600"
                    onClick={() => {
                      if (!currentTemplate.tags.includes(tag)) {
                        setCurrentTemplate({
                          ...currentTemplate,
                          tags: [...currentTemplate.tags, tag],
                        });
                      }
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="personalization"
          checked={currentTemplate.personalizationEnabled}
          onCheckedChange={(checked) =>
            setCurrentTemplate({
              ...currentTemplate,
              personalizationEnabled: checked,
            })
          }
        />
        <Label htmlFor="personalization" className="text-forest-500">
          Enable Personalization
        </Label>
      </div>
      <div>
        <Label htmlFor="sendingFrequency" className="text-forest-500">
          Sending Frequency (hours)
        </Label>
        <Slider
          id="sendingFrequency"
          min={1}
          max={168}
          step={1}
          value={[currentTemplate.sendingFrequency || 24]}
          onValueChange={([value]) =>
            setCurrentTemplate({
              ...currentTemplate,
              sendingFrequency: value,
            })
          }
          className="text-forest-500"
        />
        <span className="text-forest-500 text-sm">
          {currentTemplate.sendingFrequency || 24} hours
        </span>
      </div>
    </div>
  );

  const TemplatePreview = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-forest-500">Preview</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            className="text-forest-500 hover:bg-meadow-600"
          >
            <Monitor className="w-4 h-4 mr-2" /> Desktop
          </Button>
          <Button
            variant={previewMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            className="text-forest-500 hover:bg-meadow-600"
          >
            <Smartphone className="w-4 h-4 mr-2" /> Mobile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSource(!showSource)}
            className="text-forest-500 hover:bg-meadow-600"
          >
            {showSource ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Code className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <Card
        className={`bg-white ${
          previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""
        }`}
      >
        <CardContent className="p-4">
          {showSource ? (
            <pre className="bg-forest-500 p-4 rounded-md overflow-x-auto text-sm text-white">
              <code>{currentTemplate.content}</code>
            </pre>
          ) : (
            <>
              {currentTemplate.channel === "email" && (
                <>
                  <div className="mb-4">
                    <strong className="text-forest-500">Subject:</strong>{" "}
                    <span className="text-forest-700">
                      {currentTemplate.subjectLine || "No subject"}
                    </span>
                  </div>
                  <div className="mb-4">
                    <strong className="text-forest-500">Preview:</strong>{" "}
                    <span className="text-forest-700">
                      {currentTemplate.previewText || "No preview text"}
                    </span>
                  </div>
                </>
              )}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentTemplate.content }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const TemplateGrid = () => (
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
                  {template.channel === "email" ? (
                    <Mail className="mr-2 h-4 w-4" />
                  ) : (
                    <Bell className="mr-2 h-4 w-4" />
                  )}
                  {template.channel}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4 truncate">
                {template.channel === "email"
                  ? template.subjectLine
                  : template.content}
              </p>
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={`${
                    template.status === "active"
                      ? "bg-green-900 text-green-300 border-green-500"
                      : template.status === "archived"
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
                className="pl-10 pr-4 py-2 bg-forest-500 text-white border-meadow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent"
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
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent className="bg-forest-500 text-white">
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-forest-500 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-forest-500 text-white">
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
              <Card className="bg-forest-500 border-meadow-500">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-forest-600 border-meadow-500">
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
                        className="hover:bg-forest-600 border-meadow-500"
                      >
                        <TableCell className="font-medium text-white">
                          {template.name}
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge
                            variant="outline"
                            className="bg-forest-600 text-meadow-500 border-meadow-500"
                          >
                            {template.channel === "email" ? (
                              <Mail className="mr-2 h-4 w-4" />
                            ) : (
                              <Bell className="mr-2 h-4 w-4" />
                            )}
                            {template.channel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {template.channel === "email"
                            ? template.subjectLine
                            : template.content}
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge
                            variant="outline"
                            className={`${
                              template.status === "active"
                                ? "bg-green-900 text-green-300 border-green-500"
                                : template.status === "archived"
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
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
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
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
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
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
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
                                    className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
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

        <Sheet
          open={isTemplateSheetOpen}
          onOpenChange={setIsTemplateSheetOpen}
          onClose={() => setCurrentStep(0)}
        >
          <SheetContent
            className={`w-full sm:max-w-[1200px] p-0 bg-meadow-500`}
            side="right"
          >
            <SheetHeader className="p-6 border-b border-forest-500">
              <SheetTitle className="text-forest-500 text-2xl">
                {currentTemplate.id ? "Edit Template" : "Create New Template"}
              </SheetTitle>
              <SheetDescription className="text-forest-700">
                Design your message template and preview it in real-time
              </SheetDescription>
            </SheetHeader>
            <div className={`flex h-[calc(100vh-200px)]`}>
              <div className="w-1/2 p-6 border-r border-forest-500">
                <ScrollArea className="h-full pr-4">
                  <Tabs value={steps[currentStep]} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-meadow-600">
                      {steps.map((step, index) => (
                        <TabsTrigger
                          key={step}
                          value={step}
                          disabled={index > currentStep}
                          className="text-forest-500 data-[state=active]:bg-meadow-500"
                          onClick={() => setCurrentStep(index)}
                        >
                          {step}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="Design">
                      <TemplateEditor />
                    </TabsContent>
                    <TabsContent value="Settings">
                      <TemplateSettings />
                    </TabsContent>
                    <TabsContent value="Preview">
                      <TemplatePreview />
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </div>
              <div className="w-1/2 p-6">
                <ScrollArea className="h-full">
                  <TemplatePreview />
                </ScrollArea>
              </div>
            </div>
            <SheetFooter className="p-6 border-t border-forest-500">
              <div className="flex justify-between items-center w-full">
                <div>
                  {currentStep > 0 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      variant="outline"
                      className="mr-2 border-forest-500 text-forest-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      variant="outline"
                      className="border-forest-500 text-forest-500"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveTemplate}
                    className="bg-forest-500 text-meadow-500 hover:bg-forest-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {currentTemplate.id ? "Update Template" : "Create Template"}
                  </Button>
                </div>
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
