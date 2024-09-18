import React, { useState, useRef } from "react";
import {
  Edit2,
  Smartphone,
  Monitor,
  Code,
  Eye,
  Save,
  Mail,
  Bell,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EmailTemplateEditor = ({
  currentTemplate,
  setCurrentTemplate,
  profiles,
  placeholders,
  tagSuggestions,
}) => {
  const [previewMode, setPreviewMode] = useState("desktop");
  const quillRef = useRef(null);

  const BrowserFrame = ({ children }) => (
    <div className="border-2 border-forest-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="bg-forest-200 p-2 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-grow">
          <div className="bg-forest-100 rounded px-2 py-1 text-sm text-forest-700 truncate">
            https://example.com/email-preview
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );

  const PhoneFrame = ({ children }) => (
    <div className="mx-auto w-[300px] h-[600px] bg-white rounded-[3rem] border-[14px] border-forest-100 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 inset-x-0 h-6 bg-forest-200 rounded-b-3xl"></div>
      <div className="h-full w-full bg-white overflow-y-auto">{children}</div>
    </div>
  );

  const PushNotification = () => (
    <div className="bg-forest-100 p-4 rounded-lg shadow-md m-2">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-meadow-500 rounded-full flex items-center justify-center mr-2">
          <Bell className="w-4 h-4 text-forest-700" />
        </div>
        <div>
          <h3 className="font-semibold text-forest-800">App Name</h3>
          <p className="text-xs text-forest-600">now</p>
        </div>
      </div>
      <p className="text-sm text-forest-700">
        {quillRef.current ? quillRef.current.getEditor().getText() : ""}
      </p>
    </div>
  );

  const insertPlaceholder = (placeholder) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    let position = 0;
    if (range) {
      position = range.index;
    }
    editor.insertText(position, `{{${placeholder}}}`);
  };

  const handleContentChange = (content) => {
    setCurrentTemplate({ ...currentTemplate, content });
  };

  return (
    <div className="flex h-full bg-forest-700">
      {/* Editor Panel */}
      <div className="w-1/2 p-6 bg-forest-600 overflow-y-auto">
        <ScrollArea className="h-full pr-4">
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
                <Label htmlFor="profile" className="text-meadow-500">
                  Profile
                </Label>
                <Select
                  id="profile"
                  value={currentTemplate.profile}
                  onValueChange={(value) => {
                    const selectedProfile = profiles.find(
                      (p) => p.id === value
                    );
                    setCurrentTemplate({
                      ...currentTemplate,
                      profile: value,
                      channel: selectedProfile.type,
                    });
                  }}
                >
                  <SelectTrigger className="bg-forest-500 text-white border-meadow-500">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-600 text-white">
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <Label htmlFor="status" className="text-meadow-500">
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
                  <SelectContent className="bg-forest-600 text-white">
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
                ref={quillRef}
                theme="snow"
                value={currentTemplate.content}
                onChange={handleContentChange}
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
            <div>
              <Label htmlFor="placeholders" className="text-meadow-500">
                Insert Placeholder
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {placeholders.map((placeholder) => (
                  <Button
                    key={placeholder}
                    variant="outline"
                    size="sm"
                    onClick={() => insertPlaceholder(placeholder)}
                    className="bg-forest-600 text-meadow-500 border-meadow-500 hover:bg-forest-700"
                  >
                    {placeholder}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="tags" className="text-meadow-500">
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
                        setCurrentTemplate({
                          ...currentTemplate,
                          tags: newTags,
                        });
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
                      className="text-meadow-500 border-meadow-500 bg-forest-600 hover:bg-forest-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Tag
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-forest-600 border-meadow-500">
                    <ScrollArea className="h-64">
                      {tagSuggestions.map((tag) => (
                        <Button
                          key={tag}
                          variant="ghost"
                          className="w-full justify-start text-meadow-500 hover:bg-forest-700"
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
          </div>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 p-6 bg-forest-800 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-meadow-500">Preview</h2>
          <div className="flex space-x-2">
            <Button
              variant={previewMode === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
              className="text-meadow-500 hover:bg-forest-700"
            >
              <Monitor className="w-4 h-4 mr-2" /> Desktop
            </Button>
            <Button
              variant={previewMode === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
              className="text-meadow-500 hover:bg-forest-700"
            >
              <Smartphone className="w-4 h-4 mr-2" /> Mobile
            </Button>
            <Button
              variant={previewMode === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("code")}
              className="text-meadow-500 hover:bg-forest-700"
            >
              {previewMode === "code" ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Code className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {previewMode === "code" ? (
          <Card className="bg-forest-700 border-meadow-700">
            <CardContent className="p-4">
              <pre className="text-meadow-300 overflow-x-auto">
                <code>{currentTemplate.content}</code>
              </pre>
            </CardContent>
          </Card>
        ) : (
          <>
            {currentTemplate.channel === "email" ? (
              previewMode === "desktop" ? (
                <BrowserFrame>
                  <div className="prose prose-meadow max-w-none">
                    <h2 className="text-forest-800">
                      {currentTemplate.subjectLine}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentTemplate.content,
                      }}
                    />
                  </div>
                </BrowserFrame>
              ) : (
                <PhoneFrame>
                  <div className="p-4">
                    <div className="bg-forest-100 rounded-lg p-4 shadow-md">
                      <h2 className="text-forest-800 text-lg font-semibold mb-2">
                        {currentTemplate.subjectLine}
                      </h2>
                      <div
                        className="prose prose-sm prose-meadow"
                        dangerouslySetInnerHTML={{
                          __html: currentTemplate.content,
                        }}
                      />
                    </div>
                  </div>
                </PhoneFrame>
              )
            ) : currentTemplate.channel === "push" ? (
              <PhoneFrame>
                <PushNotification />
              </PhoneFrame>
            ) : (
              <PhoneFrame>
                <div className="p-4">
                  <div className="bg-forest-100 rounded-lg p-4 shadow-md">
                    <h2 className="text-forest-800 text-lg font-semibold mb-2">
                      SMS Message
                    </h2>
                    <p className="text-forest-700">
                      {quillRef.current
                        ? quillRef.current.getEditor().getText()
                        : ""}
                    </p>
                  </div>
                </div>
              </PhoneFrame>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
