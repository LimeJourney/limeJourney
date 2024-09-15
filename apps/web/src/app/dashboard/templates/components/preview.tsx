import React, { useState } from "react";
import { Eye, Code, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TemplatePreview = ({ currentTemplate }) => {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSource, setShowSource] = useState(false);

  const replacePlaceholders = (content) => {
    const replacements = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      order_number: "ORD-12345",
      tracking_number: "TRK-67890",
      total_amount: "$99.99",
      coupon_code: "SUMMER25",
      expiration_date: "2023-08-31",
    };

    return content.replace(
      /{{(\w+)}}/g,
      (match, p1) => replacements[p1] || match
    );
  };

  const previewContent = replacePlaceholders(currentTemplate.content);

  const EmailPreview = () => (
    <Card
      className={`bg-white ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}
    >
      <CardContent className="p-4">
        {showSource ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{currentTemplate.content}</code>
          </pre>
        ) : (
          <>
            <div className="mb-4">
              <strong className="text-gray-700">Subject:</strong>{" "}
              <span className="text-gray-600">
                {currentTemplate.subjectLine}
              </span>
            </div>
            <div className="mb-4">
              <strong className="text-gray-700">Preview:</strong>{" "}
              <span className="text-gray-500">
                {currentTemplate.previewText}
              </span>
            </div>
            <div
              className="prose max-w-none"
              style={{ fontSize: `${currentTemplate.fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );

  const PushNotificationPreview = () => (
    <div className="relative w-[375px] h-[812px] mx-auto bg-gray-800 rounded-[60px] overflow-hidden shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-6 bg-black"></div>
      <div className="absolute top-6 left-0 right-0 bottom-0 bg-gradient-to-b from-blue-500 to-purple-600 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-4 shadow-lg">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
            <div>
              <h3 className="text-white font-semibold">App Name</h3>
              <p className="text-white/70 text-xs">now</p>
            </div>
          </div>
          <p className="text-white">{previewContent}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-meadow-500">Preview</h3>
        <div className="flex space-x-2">
          {currentTemplate.channel === "email" && (
            <Select value={previewMode} onValueChange={setPreviewMode}>
              <SelectTrigger className="bg-forest-600 text-white border-meadow-500/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-forest-600 text-white border-meadow-500/50">
                <SelectItem value="desktop">
                  <div className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    Desktop
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSource(!showSource)}
            className="bg-forest-600 text-white border-meadow-500/50"
          >
            {showSource ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Code className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {currentTemplate.channel === "email" ? (
        <Tabs value={previewMode}>
          <TabsContent value="desktop" className="mt-0">
            <EmailPreview />
          </TabsContent>
          <TabsContent value="mobile" className="mt-0">
            <div className="max-w-[375px] mx-auto">
              <EmailPreview />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <PushNotificationPreview />
      )}

      {currentTemplate.channel === "push" && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-meadow-500 mb-2">
            Character Count
          </h4>
          <p className="text-white">
            {previewContent.length} / 180 characters
            {previewContent.length > 180 && (
              <span className="text-red-500 ml-2">
                Warning: Exceeds recommended length for some devices
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;
