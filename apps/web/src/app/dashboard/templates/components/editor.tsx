import React, { useState } from "react";
import {
  Mail,
  Settings,
  Smartphone,
  Monitor,
  Eye,
  Code,
  ChevronDown,
  Plus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const IntegratedEmailTemplateEditor = () => {
  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSource, setShowSource] = useState(false);
  const [template, setTemplate] = useState({
    name: "",
    subject: "",
    previewText: "",
    content: "<p>Hello {{first_name}},</p><p>Your content here...</p>",
    channel: "email",
  });

  const placeholders = [
    { key: "first_name", description: "Customer's first name" },
    { key: "last_name", description: "Customer's last name" },
    { key: "email", description: "Customer's email address" },
    { key: "company", description: "Customer's company name" },
    {
      key: "subscription_plan",
      description: "Customer's current subscription plan",
    },
    {
      key: "last_purchase_date",
      description: "Date of customer's last purchase",
    },
  ];

  const handleContentChange = (e) => {
    setTemplate({ ...template, content: e.target.value });
  };

  const insertPlaceholder = (placeholder) => {
    setTemplate({
      ...template,
      content: template.content + `{{${placeholder}}}`,
    });
  };

  const replacePlaceholders = (content) => {
    const replacements = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      company: "Acme Corp",
      subscription_plan: "Premium",
      last_purchase_date: "2023-09-15",
    };

    return content.replace(
      /{{(\w+)}}/g,
      (match, p1) => replacements[p1] || match
    );
  };

  const TemplateEditor = () => (
    <div className="space-y-4">
      <Input
        placeholder="Template Name"
        value={template.name}
        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
        className="bg-forest-600 text-meadow-100 border-meadow-500/30 placeholder-meadow-300/50"
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-forest-600">
          <TabsTrigger
            value="design"
            className="text-meadow-300 data-[state=active]:bg-forest-500"
          >
            <Mail className="w-4 h-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-meadow-300 data-[state=active]:bg-forest-500"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="space-y-4 mt-4">
          <Input
            placeholder="Subject Line"
            value={template.subject}
            onChange={(e) =>
              setTemplate({ ...template, subject: e.target.value })
            }
            className="bg-forest-600 text-meadow-100 border-meadow-500/30 placeholder-meadow-300/50"
          />
          <Input
            placeholder="Preview Text"
            value={template.previewText}
            onChange={(e) =>
              setTemplate({ ...template, previewText: e.target.value })
            }
            className="bg-forest-600 text-meadow-100 border-meadow-500/30 placeholder-meadow-300/50"
          />
          <div className="border rounded-md border-meadow-500/30">
            <div className="bg-forest-600 p-2 flex items-center space-x-2 border-b border-meadow-500/30">
              <Button
                variant="ghost"
                size="sm"
                className="text-meadow-300 hover:bg-forest-500 hover:text-meadow-100"
              >
                B
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-meadow-300 hover:bg-forest-500 hover:text-meadow-100"
              >
                I
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-meadow-300 hover:bg-forest-500 hover:text-meadow-100"
              >
                U
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-meadow-300 hover:bg-forest-500 hover:text-meadow-100"
                  >
                    Placeholders <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-forest-600 border-meadow-500/30">
                  <ScrollArea className="h-64">
                    {placeholders.map((p) => (
                      <Button
                        key={p.key}
                        variant="ghost"
                        className="w-full justify-start text-meadow-300 hover:bg-forest-500 hover:text-meadow-100"
                        onClick={() => insertPlaceholder(p.key)}
                      >
                        {p.key}
                        <span className="text-xs text-meadow-400 ml-2">
                          {p.description}
                        </span>
                      </Button>
                    ))}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              value={template.content}
              onChange={handleContentChange}
              className="w-full h-64 p-2 bg-forest-700 text-meadow-100 focus:outline-none resize-none border-0"
              placeholder="Enter your email content here..."
            />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-4">
          <p className="text-meadow-300">Template settings will go here...</p>
        </TabsContent>
      </Tabs>
    </div>
  );

  const TemplatePreview = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-meadow-300">Preview</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            className="text-meadow-300 hover:bg-forest-600"
          >
            <Monitor className="w-4 h-4 mr-2" /> Desktop
          </Button>
          <Button
            variant={previewMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            className="text-meadow-300 hover:bg-forest-600"
          >
            <Smartphone className="w-4 h-4 mr-2" /> Mobile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSource(!showSource)}
            className="text-meadow-300 hover:bg-forest-600"
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
        className={`bg-white ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}
      >
        <CardContent className="p-4">
          {showSource ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{template.content}</code>
            </pre>
          ) : (
            <>
              <div className="mb-4">
                <strong className="text-gray-700">Subject:</strong>{" "}
                <span className="text-gray-600">
                  {template.subject || "No subject"}
                </span>
              </div>
              <div className="mb-4">
                <strong className="text-gray-700">Preview:</strong>{" "}
                <span className="text-gray-500">
                  {template.previewText || "No preview text"}
                </span>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: replacePlaceholders(template.content),
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="bg-meadow-500/20 text-meadow-300">
          {template.channel.toUpperCase()}
        </Badge>
        <Button className="bg-meadow-500 text-forest-800 hover:bg-meadow-600">
          <Send className="w-4 h-4 mr-2" /> Send Test
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-forest-800 min-h-screen p-6">
      <Card className="max-w-7xl mx-auto bg-forest-700 shadow-xl border-meadow-500/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-meadow-300">
              Create New Template
            </h1>
            <Button className="bg-meadow-500 text-forest-800 hover:bg-meadow-600">
              Save Template
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3">
              <TemplateEditor />
            </div>
            <div className="col-span-2">
              <TemplatePreview />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedEmailTemplateEditor;
