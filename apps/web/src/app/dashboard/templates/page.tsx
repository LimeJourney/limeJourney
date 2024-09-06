// "use client";
// import React, { useState, useEffect } from "react";
// import { Plus, Search, Edit2, Trash2, Copy, Send, Eye } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetFooter,
// } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// // Import a rich text editor component (e.g., React-Quill)
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// // Mock data for templates
// const mockTemplates = [
//   {
//     id: "1",
//     name: "Welcome Email",
//     channel: "email",
//     content: `<h1>Welcome to our platform!</h1><p>We're excited to have you on board.</p>`,
//   },
//   {
//     id: "2",
//     name: "Order Confirmation",
//     channel: "email",
//     content:
//       "<h2>Your order is confirmed</h2><p>Thank you for your purchase. Your order #{{orderId}} has been confirmed.</p>",
//   },
//   {
//     id: "3",
//     name: "Appointment Reminder",
//     channel: "sms",
//     content:
//       "Reminder: Your appointment is scheduled for {{date}} at {{time}}. Reply Y to confirm.",
//   },
//   {
//     id: "4",
//     name: "Password Reset",
//     channel: "email",
//     content:
//       "<p>Click the link below to reset your password:</p><p>{{resetLink}}</p>",
//   },
//   {
//     id: "5",
//     name: "Promotional Offer",
//     channel: "push",
//     content: "Flash Sale! 50% off all items for the next 24 hours. Shop now!",
//   },
// ];

// // Mock data for channels
// const mockChannels = [
//   { id: "email", name: "Email" },
//   { id: "sms", name: "SMS" },
//   { id: "push", name: "Push Notification" },
//   { id: "whatsapp", name: "WhatsApp" },
// ];

// const TemplateManagement = () => {
//   const [templates, setTemplates] = useState(mockTemplates);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
//   const [currentTemplate, setCurrentTemplate] = useState({
//     id: "",
//     name: "",
//     channel: "",
//     content: "",
//   });
//   const [channels] = useState(mockChannels);

//   const filteredTemplates = templates.filter(
//     (template) =>
//       template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       template.channel.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSaveTemplate = () => {
//     if (currentTemplate.id) {
//       setTemplates(
//         templates.map((t) =>
//           t.id === currentTemplate.id ? currentTemplate : t
//         )
//       );
//     } else {
//       const newTemplate = {
//         ...currentTemplate,
//         id: (templates.length + 1).toString(),
//       };
//       setTemplates([...templates, newTemplate]);
//     }
//     setIsTemplateSheetOpen(false);
//     setCurrentTemplate({ id: "", name: "", channel: "", content: "" });
//   };

//   const handleDeleteTemplate = (templateId: string) => {
//     setTemplates(templates.filter((t) => t.id !== templateId));
//   };

//   const TemplateEditor = () => (
//     <div className="flex flex-col h-full">
//       <div className="space-y-4 mb-4">
//         <div>
//           <Label htmlFor="name" className="text-white">
//             Name
//           </Label>
//           <Input
//             id="name"
//             value={currentTemplate.name}
//             onChange={(e) =>
//               setCurrentTemplate({ ...currentTemplate, name: e.target.value })
//             }
//             className="bg-forest-600 text-white border-meadow-500/50"
//           />
//         </div>
//         <div>
//           <Label htmlFor="channel" className="text-white">
//             Channel
//           </Label>
//           <Select
//             onValueChange={(value) =>
//               setCurrentTemplate({ ...currentTemplate, channel: value })
//             }
//             defaultValue={currentTemplate.channel}
//           >
//             <SelectTrigger className="bg-forest-600 text-white border-meadow-500/50">
//               <SelectValue placeholder="Select channel" />
//             </SelectTrigger>
//             <SelectContent className="bg-forest-600 text-white border-meadow-500/50">
//               {channels.map((channel) => (
//                 <SelectItem key={channel.id} value={channel.id}>
//                   {channel.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <Label className="text-white mb-2">Content</Label>
//       <div className="flex-grow">
//         <ReactQuill
//           theme="snow"
//           value={currentTemplate.content}
//           onChange={(content) =>
//             setCurrentTemplate({ ...currentTemplate, content })
//           }
//           className="bg-forest-600 text-white border-meadow-500/50 h-full"
//         />
//       </div>
//     </div>
//   );

//   const TemplatePreview = () => (
//     <div className="bg-white p-4 rounded-md h-full overflow-auto">
//       <div dangerouslySetInnerHTML={{ __html: currentTemplate.content }} />
//     </div>
//   );

//   return (
//     <div className="px-8 py-6 bg-forest-700 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-white">Message Templates</h1>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search templates..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 bg-forest-600 text-white border-meadow-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent"
//               />
//             </div>
//             <Button
//               onClick={() => {
//                 setCurrentTemplate({
//                   id: "",
//                   name: "",
//                   channel: "",
//                   content: "",
//                 });
//                 setIsTemplateSheetOpen(true);
//               }}
//               className="bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add Template
//             </Button>
//           </div>
//         </div>

//         <Card className="bg-forest-600 border-meadow-500/20">
//           <Table>
//             <TableHeader>
//               <TableRow className="hover:bg-forest-700 border-meadow-500/20">
//                 <TableHead className="text-white">Name</TableHead>
//                 <TableHead className="text-white">Channel</TableHead>
//                 <TableHead className="text-white">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredTemplates.map((template) => (
//                 <TableRow
//                   key={template.id}
//                   className="hover:bg-forest-700 border-meadow-500/20"
//                 >
//                   <TableCell className="font-medium text-white">
//                     {template.name}
//                   </TableCell>
//                   <TableCell className="text-neutral-300">
//                     {template.channel}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 setCurrentTemplate(template);
//                                 setIsTemplateSheetOpen(true);
//                               }}
//                               className="text-neutral-300 hover:text-black hover:bg-meadow-500"
//                             >
//                               <Edit2 className="h-4 w-4" />
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>Edit Template</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => handleDeleteTemplate(template.id)}
//                               className="text-neutral-300 hover:text-black hover:bg-meadow-500"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>Delete Template</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 const newTemplate = {
//                                   ...template,
//                                   id: "",
//                                   name: `${template.name} (Copy)`,
//                                 };
//                                 setCurrentTemplate(newTemplate);
//                                 setIsTemplateSheetOpen(true);
//                               }}
//                               className="text-neutral-300 hover:text-black hover:bg-meadow-500"
//                             >
//                               <Copy className="h-4 w-4" />
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>Duplicate Template</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 /* Implement send test message functionality */
//                               }}
//                               className="text-neutral-300 hover:text-black hover:bg-meadow-500"
//                             >
//                               <Send className="h-4 w-4" />
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>Send Test Message</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>

//         <Sheet open={isTemplateSheetOpen} onOpenChange={setIsTemplateSheetOpen}>
//           <SheetContent
//             className="w-full sm:max-w-[1200px] p-0 bg-forest-500"
//             side="right"
//           >
//             <SheetHeader className="p-6 border-b border-meadow-500/20">
//               <SheetTitle className="text-meadow-500 text-2xl">
//                 {currentTemplate.id ? "Edit Template" : "Create New Template"}
//               </SheetTitle>
//               <SheetDescription className="text-white/70">
//                 Design your message template and preview it in real-time
//               </SheetDescription>
//             </SheetHeader>
//             <div className="flex h-[calc(100vh-150px)]">
//               <div className="w-1/2 p-6 border-r border-meadow-500/20">
//                 <ScrollArea className="h-full pr-4">
//                   <TemplateEditor />
//                 </ScrollArea>
//               </div>
//               <div className="w-1/2 p-6">
//                 <h3 className="text-lg font-semibold text-meadow-500 mb-4">
//                   Preview
//                 </h3>
//                 <ScrollArea className="h-[calc(100vh-250px)]">
//                   <TemplatePreview />
//                 </ScrollArea>
//               </div>
//             </div>
//             <SheetFooter className="p-6 border-t border-meadow-500/20">
//               <Button
//                 onClick={handleSaveTemplate}
//                 className="bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
//               >
//                 {currentTemplate.id ? "Update Template" : "Create Template"}
//               </Button>
//             </SheetFooter>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </div>
//   );
// };

// export default TemplateManagement;
"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function ({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

export default function EmailEditor() {
  const [content, setContent] = useState("<p>Hello {{first name}},</p>");
  const [preview, setPreview] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    // Replace template variables with sample data
    const replacedContent = replaceTemplateVariables(content);
    setPreview(replacedContent);
  }, [content]);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const replaceTemplateVariables = (text) => {
    const variables = {
      "{{first name}}": "John",
      "{{last name}}": "Doe",
      "{{email}}": "john.doe@example.com",
    };

    return text.replace(/{{[\w\s]+}}/g, (match) => {
      return variables[match] || match;
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Template Editor</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Editor</h2>
          <QuillNoSSRWrapper
            forwardedRef={quillRef}
            value={content}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            theme="snow"
            className="h-[400px] mb-12"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <div
            className="border p-4 h-[450px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  );
}
