import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Smartphone, Code, Eye } from "lucide-react";

const RefinedEmailEditorPreviewer = ({ template, setTemplate }) => {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSource, setShowSource] = useState(false);

  const handleEditorChange = (content, editor) => {
    setTemplate({ ...template, content });
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 p-6 border-r border-forest-500">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-meadow-600">
            <TabsTrigger
              value="content"
              className="text-forest-500 data-[state=active]:bg-meadow-500"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-forest-500 data-[state=active]:bg-meadow-500"
            >
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="content">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-forest-500">
                  Subject Line
                </Label>
                <Input
                  id="subject"
                  value={template.subjectLine}
                  onChange={(e) =>
                    setTemplate({ ...template, subjectLine: e.target.value })
                  }
                  className="bg-forest-500 text-white border-meadow-500"
                />
              </div>
              <div>
                <Label htmlFor="previewText" className="text-forest-500">
                  Preview Text
                </Label>
                <Input
                  id="previewText"
                  value={template.previewText}
                  onChange={(e) =>
                    setTemplate({ ...template, previewText: e.target.value })
                  }
                  className="bg-forest-500 text-white border-meadow-500"
                />
              </div>
              <Editor
                apiKey="your-tinymce-api-key"
                value={template.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | link image | removeformat | help",
                  content_style:
                    "body { font-family:Arial,Helvetica,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <Label htmlFor="sender" className="text-forest-500">
                  Sender Name
                </Label>
                <Input
                  id="sender"
                  value={template.senderName}
                  onChange={(e) =>
                    setTemplate({ ...template, senderName: e.target.value })
                  }
                  className="bg-forest-500 text-white border-meadow-500"
                />
              </div>
              <div>
                <Label htmlFor="replyTo" className="text-forest-500">
                  Reply-To Email
                </Label>
                <Input
                  id="replyTo"
                  value={template.replyTo}
                  onChange={(e) =>
                    setTemplate({ ...template, replyTo: e.target.value })
                  }
                  className="bg-forest-500 text-white border-meadow-500"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-1/2 p-6">
        <div className="flex justify-between items-center mb-4">
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
          className={`bg-white ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}
        >
          <CardContent className="p-4">
            {showSource ? (
              <pre className="bg-forest-500 p-4 rounded-md overflow-x-auto text-sm text-white">
                <code>{template.content}</code>
              </pre>
            ) : (
              <>
                <div className="mb-4">
                  <strong className="text-forest-500">Subject:</strong>{" "}
                  <span className="text-forest-700">
                    {template.subjectLine || "No subject"}
                  </span>
                </div>
                <div className="mb-4">
                  <strong className="text-forest-500">Preview:</strong>{" "}
                  <span className="text-forest-700">
                    {template.previewText || "No preview text"}
                  </span>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: template.content }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefinedEmailEditorPreviewer;
