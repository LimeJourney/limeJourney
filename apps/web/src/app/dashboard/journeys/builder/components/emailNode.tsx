import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Mail, Info, Settings } from "lucide-react";
import {
  templateService,
  ChannelType,
  TemplateStatus,
} from "@/services/templateService";
import { messagingProfileService } from "@/services/messagingProfileService";

const EmailNodeForm = ({ node, updateNodeData }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [messagingProfile, setMessagingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await templateService.getTemplates({
          channel: ChannelType.EMAIL,
          status: TemplateStatus.ACTIVE,
        });
        setTemplates(fetchedTemplates);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch email templates. Please try again.");
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.messagingProfileId) {
      const fetchMessagingProfile = async () => {
        try {
          const profile = await messagingProfileService.getProfileById(
            selectedTemplate.messagingProfileId
          );
          setMessagingProfile(profile);
        } catch (err) {
          setError("Failed to fetch messaging profile. Please try again.");
        }
      };

      fetchMessagingProfile();
    }
  }, [selectedTemplate]);

  const handleTemplateChange = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template);
    updateNodeData("templateId", templateId);
    updateNodeData("subject", template.subjectLine);
    updateNodeData("templateName", template.name);
  };

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-meadow-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full bg-destructive/20 text-destructive">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-16 w-16 mb-4" />
          <p className="text-lg text-center">{error}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setLoading(true)}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="w-full h-full bg-warning/20 text-meadow-500 border border-meadow-700">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-16 w-16 mb-6" />
          <p className="text-lg text-center mb-8">
            No active email templates found. Please create an active email
            template to continue.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              /* Navigate to template creation page */
            }}
            className="bg-forest-500 text-white border border-meadow-700"
          >
            Create Email Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-forest-500 text-white shadow-lg border border-meadow-700">
      <CardHeader>
        {/* <CardTitle className="text-3xl font-bold text-meadow-300 flex items-center">
          <Mail className="mr-2" /> Configure Email Node
        </CardTitle> */}
        <CardDescription className="text-meadow-200">
          Set up your email configuration for this workflow node.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-forest-800">
            <TabsTrigger
              value="template"
              className="data-[state=active]:bg-meadow-700"
            >
              Template
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-meadow-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="template">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="template"
                  className="text-meadow-300 mb-2 block text-lg"
                >
                  Select Template
                </Label>
                <Select
                  onValueChange={handleTemplateChange}
                  value={selectedTemplate?.id}
                >
                  <SelectTrigger
                    id="template"
                    className="w-full bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                  >
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-800 border-forest-700">
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id}
                        className="text-white hover:bg-forest-700"
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="bg-forest-600 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                    Template Preview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="subject"
                        className="text-meadow-300 mb-2 block"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={selectedTemplate.subjectLine}
                        readOnly
                        className="bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="preview"
                        className="text-meadow-300 mb-2 block"
                      >
                        Content Preview
                      </Label>
                      <div className="bg-forest-800 border border-forest-700 rounded p-4 text-white">
                        {selectedTemplate.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-6">
              {messagingProfile ? (
                <div className="bg-forest-600 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                    Messaging Profile
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="integration"
                        className="text-meadow-300 mb-2 block"
                      >
                        Integration
                      </Label>
                      <Input
                        id="integration"
                        value={messagingProfile.integration.name}
                        readOnly
                        className="bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="sender"
                        className="text-meadow-300 mb-2 block"
                      >
                        Sender Email
                      </Label>
                      <Input
                        id="sender"
                        value={messagingProfile.senderEmail}
                        readOnly
                        className="bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-forest-600 rounded-lg">
                  <p className="text-meadow-300 text-lg">
                    Select a template to view settings
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailNodeForm;
