"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Info,
  Mail,
  User,
  MessageSquare,
  GitBranch,
  CheckCircle,
  XCircle,
  Flag,
  Plus,
  Save,
  Clock,
  Zap,
  MessageCircle,
  Bell,
  Shuffle,
  UsersIcon,
  CalendarIcon,
  InfoIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { useJourneyContext } from "@/app/contexts/journeyContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventsService } from "@/services/eventsService";
import segmentationService, { Segment } from "@/services/segmentationService";
import {
  CreateJourneyDTO,
  journeyManagementService,
} from "@/services/journeyService";
const InfoTooltip = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className="h-4 w-4 ml-2 text-meadow-400 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="bg-forest-700 text-white p-2 max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TriggerNodeForm = ({ node, updateNodeData }) => {
  const [triggerType, setTriggerType] = useState(
    node.data.triggerType || "event"
  );
  const [segmentAction, setSegmentAction] = useState(
    node.data.segmentAction || "joins"
  );
  const [events, setEvents] = useState<string[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const { toast } = useToast();
  useEffect(() => {
    // Fetch events and segments when the component mounts
    const fetchData = async () => {
      try {
        const [eventNames, segmentList] = await Promise.all([
          eventsService.getUniqueEventNames(),
          segmentationService.listSegments(),
        ]);
        setEvents(eventNames);
        setSegments(segmentList);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch events and segments.",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    updateNodeData("triggerType", triggerType);
  }, [triggerType]);

  useEffect(() => {
    updateNodeData("segmentAction", segmentAction);
  }, [segmentAction]);

  const handleUpdateNodeData = (key, value) => {
    updateNodeData(key, value);
  };

  return (
    <Card className="w-full bg-forest-9050 text-white shadow-lg border border-meadow-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-meadow-300">
          Configure Trigger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-meadow-400 mb-4">
          Select the type of trigger and configure its details to start your
          journey.
        </p>
        <Tabs
          value={triggerType}
          onValueChange={setTriggerType}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-forest-800">
            <TabsTrigger
              value="event"
              className="data-[state=active]:bg-meadow-700"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Event
            </TabsTrigger>
            <TabsTrigger
              value="segment"
              className="data-[state=active]:bg-meadow-700"
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              Segment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="event" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="event"
                  className="text-meadow-300 mb-2 block flex items-center"
                >
                  Select Event
                  <InfoTooltip content="Choose the event that will trigger this journey." />
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleUpdateNodeData("event", value)
                  }
                  value={node.data.event}
                >
                  <SelectTrigger
                    id="event"
                    className="w-full bg-forest-900 border-forest-700 focus:ring-meadow-500 text-white"
                  >
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-900 border-forest-700">
                    {events.map((event) => (
                      <SelectItem
                        key={event}
                        value={event}
                        className="text-white hover:bg-forest-800"
                      >
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="eventProperty"
                  className="text-meadow-300 mb-2 block flex items-center"
                >
                  Event Property (optional)
                  <InfoTooltip content="Specify a property of the event to further refine your trigger condition." />
                </Label>
                <Input
                  id="eventProperty"
                  placeholder="e.g., total_value"
                  value={node.data.eventProperty || ""}
                  onChange={(e) =>
                    handleUpdateNodeData("eventProperty", e.target.value)
                  }
                  className="bg-forest-900 border-forest-700 focus:ring-meadow-500 text-white placeholder-meadow-600"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="segment" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="segment"
                  className="text-meadow-300 mb-2 block flex items-center"
                >
                  Select Segment
                  <InfoTooltip content="Choose the user segment that this trigger will apply to." />
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleUpdateNodeData("segment", value)
                  }
                  value={node.data.segment}
                >
                  <SelectTrigger
                    id="segment"
                    className="w-full bg-forest-900 border-forest-700 focus:ring-meadow-500 text-white"
                  >
                    <SelectValue placeholder="Choose a segment" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-900 border-forest-700">
                    {segments.map((segment) => (
                      <SelectItem
                        key={segment.id}
                        value={segment.id}
                        className="text-white hover:bg-forest-800"
                      >
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-meadow-300 mb-2 block flex items-center">
                  Trigger When
                  <InfoTooltip content="Specify whether the journey should start when a user joins or leaves the selected segment." />
                </Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSegmentAction("joins")}
                    className={`flex-1 ${
                      segmentAction === "joins"
                        ? "bg-meadow-700 text-black border-meadow-500"
                        : "bg-forest-900 text-meadow-300 hover:bg-meadow-800 hover:text-black"
                    }`}
                  >
                    Joins Segment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSegmentAction("leaves")}
                    className={`flex-1 ${
                      segmentAction === "leaves"
                        ? "bg-meadow-700 text-black border-meadow-500"
                        : "bg-forest-900 text-meadow-300 hover:bg-meadow-800 hover:text-black"
                    }`}
                  >
                    Leaves Segment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const NodeWrapper = ({ children, icon: Icon, label, type }) => {
  const bgColor =
    {
      trigger: "bg-meadow-100",
      email: "bg-meadow-200",
      sms: "bg-meadow-300",
      pushNotification: "bg-meadow-400",
      split: "bg-meadow-300",
      abTest: "bg-meadow-400",
      exit: "bg-meadow-400",
      wait: "bg-meadow-200",
      action: "bg-meadow-300",
    }[type] || "bg-white";

  return (
    <div
      className={`${bgColor} rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-forest-300`}
      style={{ minWidth: "200px" }}
    >
      <div className="bg-forest-500 p-3">
        <div className="flex items-center space-x-2">
          <Icon className="text-white" size={20} />
          <h3 className="text-white font-semibold truncate">{label}</h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const TriggerNode = ({ data }) => {
  return (
    <NodeWrapper icon={Play} label={data.label} type="trigger">
      <div className="text-forest-700 text-sm font-medium mb-2">
        {data.triggerType === "segment"
          ? `Segment: ${data.segment} (${data.segmentAction})`
          : `Event: ${data.event}`}
      </div>
      <div className="flex items-center justify-between text-forest-600 text-xs">
        <div className="flex items-center">
          <Info size={12} className="mr-1" />
          <span>Type: {data.triggerType}</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const EmailNode = ({ data }) => {
  return (
    <NodeWrapper icon={Mail} label={data.label} type="email">
      <div className="space-y-2">
        <div className="flex items-center text-forest-700 text-sm">
          <MessageSquare size={14} className="mr-2" />
          <span className="truncate">{data.subject || "Set subject..."}</span>
        </div>
        <div className="flex items-center text-forest-700 text-sm">
          <User size={14} className="mr-2" />
          <span className="truncate">
            {data.recipient || "Set recipient..."}
          </span>
        </div>
        <div className="flex items-center text-forest-600 text-xs">
          <Zap size={12} className="mr-1" />
          <span>{data.automationType || "Manual"}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const SMSNode = ({ data }) => {
  return (
    <NodeWrapper icon={MessageCircle} label={data.label} type="sms">
      <div className="space-y-2">
        <div className="flex items-center text-forest-700 text-sm">
          <MessageSquare size={14} className="mr-2" />
          <span className="truncate">{data.message || "Set message..."}</span>
        </div>
        <div className="flex items-center text-forest-700 text-sm">
          <User size={14} className="mr-2" />
          <span className="truncate">
            {data.recipient || "Set recipient..."}
          </span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const PushNotificationNode = ({ data }) => {
  return (
    <NodeWrapper icon={Bell} label={data.label} type="pushNotification">
      <div className="space-y-2">
        <div className="flex items-center text-forest-700 text-sm">
          <MessageSquare size={14} className="mr-2" />
          <span className="truncate">{data.title || "Set title..."}</span>
        </div>
        <div className="flex items-center text-forest-700 text-sm">
          <Info size={14} className="mr-2" />
          <span className="truncate">{data.body || "Set body..."}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const SplitNode = ({ data }) => {
  return (
    <NodeWrapper icon={GitBranch} label={data.label} type="split">
      <div className="text-forest-700 text-sm mb-3">
        {data.condition || "Set condition..."}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center text-green-600 text-xs">
          <CheckCircle size={12} className="mr-1" />
          <span>Yes: {data.yesLabel || "Continue"}</span>
        </div>
        <div className="flex items-center text-red-600 text-xs">
          <XCircle size={12} className="mr-1" />
          <span>No: {data.noLabel || "Exit"}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="w-3 h-3 -bottom-1 -left-1 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-3 h-3 -bottom-1 -right-1 bg-red-500"
      />
    </NodeWrapper>
  );
};

const ABTestNode = ({ data }) => {
  return (
    <NodeWrapper icon={Shuffle} label={data.label} type="abTest">
      <div className="text-forest-700 text-sm mb-3">
        A/B Test: {data.testName || "Set test name..."}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center text-green-600 text-xs">
          <CheckCircle size={12} className="mr-1" />
          <span>A: {data.variantA || "Variant A"}</span>
        </div>
        <div className="flex items-center text-blue-600 text-xs">
          <CheckCircle size={12} className="mr-1" />
          <span>B: {data.variantB || "Variant B"}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="w-3 h-3 -bottom-1 -left-1 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="w-3 h-3 -bottom-1 -right-1 bg-blue-500"
      />
    </NodeWrapper>
  );
};

const ExitNode = ({ data }) => {
  return (
    <NodeWrapper icon={Flag} label={data.label} type="exit">
      <div className="text-forest-700 text-sm font-medium mb-2">
        {data.description || "Journey End"}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const WaitNode = ({ data }) => {
  return (
    <NodeWrapper icon={Clock} label={data.label} type="wait">
      <div className="text-forest-700 text-sm font-medium mb-2">
        Wait for: {data.duration || "Set duration..."}
      </div>
      <div className="flex items-center text-forest-600 text-xs">
        <Info size={12} className="mr-1" />
        <span>{data.condition || "No condition"}</span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const ActionNode = ({ data }) => {
  return (
    <NodeWrapper icon={Zap} label={data.label} type="action">
      <div className="text-forest-700 text-sm font-medium mb-2">
        {data.actionType || "Set action type..."}
      </div>
      <div className="flex items-center text-forest-600 text-xs">
        <Info size={12} className="mr-1" />
        <span>{data.description || "No description"}</span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 top-0 bg-meadow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bottom-0 bg-meadow-500"
      />
    </NodeWrapper>
  );
};

const nodeTypes = {
  triggerNode: TriggerNode,
  emailNode: EmailNode,
  smsNode: SMSNode,
  pushNotificationNode: PushNotificationNode,
  splitNode: SplitNode,
  abTestNode: ABTestNode,
  exitNode: ExitNode,
  waitNode: WaitNode,
  actionNode: ActionNode,
};

const Sidebar = ({ onDragStart }) => {
  const { toast } = useToast();
  const sidebarSections = [
    {
      title: "Action",
      nodes: [
        { type: "emailNode", label: "Email", icon: Mail, disabled: false },
        { type: "smsNode", label: "SMS", icon: MessageCircle, disabled: false },
        {
          type: "pushNotificationNode",
          label: "Push Notification",
          icon: Bell,
          disabled: false,
        },
      ],
    },
    {
      title: "Control",
      nodes: [
        { type: "waitNode", label: "Wait", icon: Clock, disabled: false },
        {
          type: "abTestNode",
          label: "A/B Test",
          icon: Shuffle,
          disabled: true,
        },
      ],
    },
    {
      title: "Other",
      nodes: [{ type: "exitNode", label: "Exit", icon: Flag, disabled: true }],
    },
  ];

  const handleDragStart = (event, nodeType) => {
    if (nodeType === "abTestNode") {
      event.preventDefault();
      toast({
        variant: "destructive",
        title: "Feature not available",
        description: "A/B Test node is coming soon!",
      });
    } else {
      onDragStart(event, nodeType);
    }
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-4 bg-forest-500 p-4 shadow-lg rounded-lg z-10"
      style={{ width: "250px", maxHeight: "calc(100vh - 8rem)" }}
    >
      <h2 className="text-xl font-bold mb-4 text-meadow-500">Node Types</h2>
      <ScrollArea className="pr-4" style={{ maxHeight: "calc(100vh - 12rem)" }}>
        {sidebarSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-meadow-400">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.nodes.map((node) => (
                <TooltipProvider key={node.type}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: node.disabled ? 1 : 1.05 }}
                        whileTap={{ scale: node.disabled ? 1 : 0.95 }}
                        className={`flex items-center space-x-2 bg-meadow-500 text-forest-800 p-3 rounded transition-all duration-300 ${
                          node.disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-meadow-400 cursor-move"
                        }`}
                        onDragStart={(event) =>
                          handleDragStart(event, node.type)
                        }
                        draggable={!node.disabled}
                      >
                        <node.icon size={20} />
                        <span className="font-medium">{node.label}</span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {node.disabled
                          ? "Coming soon"
                          : `Drag to add ${node.label} node`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </motion.aside>
  );
};

const NodeProperties = ({ node, setNodes, onClose }) => {
  const updateNodeData = (key, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return { ...n, data: { ...n.data, [key]: value } };
        }
        return n;
      })
    );
  };

  const renderNodeSpecificProperties = () => {
    switch (node.type) {
      case "emailNode":
        return (
          <>
            <div>
              <Label htmlFor="subject" className="text-meadow-500">
                Subject
              </Label>
              <Input
                id="subject"
                value={node.data.subject || ""}
                onChange={(e) => updateNodeData("subject", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            <div>
              <Label htmlFor="recipient" className="text-meadow-500">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={node.data.recipient || ""}
                onChange={(e) => updateNodeData("recipient", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-meadow-500">
                Email Content
              </Label>
              <Textarea
                id="content"
                value={node.data.content || ""}
                onChange={(e) => updateNodeData("content", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
                rows={5}
              />
            </div>
          </>
        );
      case "smsNode":
        return (
          <>
            <div>
              <Label htmlFor="message" className="text-meadow-500">
                Message
              </Label>
              <Textarea
                id="message"
                value={node.data.message || ""}
                onChange={(e) => updateNodeData("message", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="recipient" className="text-meadow-500">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={node.data.recipient || ""}
                onChange={(e) => updateNodeData("recipient", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
          </>
        );
      case "pushNotificationNode":
        return (
          <>
            <div>
              <Label htmlFor="title" className="text-meadow-500">
                Title
              </Label>
              <Input
                id="title"
                value={node.data.title || ""}
                onChange={(e) => updateNodeData("title", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            <div>
              <Label htmlFor="body" className="text-meadow-500">
                Body
              </Label>
              <Textarea
                id="body"
                value={node.data.body || ""}
                onChange={(e) => updateNodeData("body", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
                rows={3}
              />
            </div>
          </>
        );
      case "abTestNode":
        return (
          <>
            <div>
              <Label htmlFor="testName" className="text-meadow-500">
                Test Name
              </Label>
              <Input
                id="testName"
                value={node.data.testName || ""}
                onChange={(e) => updateNodeData("testName", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            <div>
              <Label htmlFor="variantA" className="text-meadow-500">
                Variant A
              </Label>
              <Input
                id="variantA"
                value={node.data.variantA || ""}
                onChange={(e) => updateNodeData("variantA", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            <div>
              <Label htmlFor="variantB" className="text-meadow-500">
                Variant B
              </Label>
              <Input
                id="variantB"
                value={node.data.variantB || ""}
                onChange={(e) => updateNodeData("variantB", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
          </>
        );
      case "triggerNode":
        return <TriggerNodeForm node={node} updateNodeData={updateNodeData} />;
      // Add cases for other node types as needed
      default:
        return null;
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[400px] bg-forest-500 text-white border-l border-meadow-500/20">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-meadow-500">
            Edit {node.type.replace("Node", "")}
          </SheetTitle>
          <SheetDescription className="text-meadow-300">
            Customize the properties of this node.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          <div className="space-y-6 pr-4">
            <div>
              <Label htmlFor="label" className="text-meadow-500">
                Label
              </Label>
              <Input
                id="label"
                value={node.data.label || ""}
                onChange={(e) => updateNodeData("label", e.target.value)}
                className="bg-forest-600 text-white border-meadow-500/50"
              />
            </div>
            {renderNodeSpecificProperties()}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const FlowWithProvider = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [journeyName, setJourneyName] = useState("Untitled Journey");
  const [journeyMode, setJourneyMode] = useState("Editing");

  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  const MIN_NODE_SPACING = 250; // Minimum vertical spacing between nodes

  const [events, setEvents] = useState<string[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const { newJourneyDetails, setNewJourneyDetails } = useJourneyContext();

  const [journeyDetails, setJourneyDetails] = useState(newJourneyDetails);
  const router = useRouter();

  useEffect(() => {
    if (newJourneyDetails) {
      setJourneyDetails(newJourneyDetails);
      setNewJourneyDetails(null); // Clear from context after transferring to local state
    } else if (!journeyDetails) {
      // If there are no details in context or local state, redirect to management page
      router.push("/dashboard/journeys");
    }
  }, [newJourneyDetails, setNewJourneyDetails, journeyDetails, router]);

  // useEffect(() => {
  //   // Fetch events and segments when the component mounts
  //   const fetchData = async () => {
  //     try {
  //       const [eventNames, segmentList] = await Promise.all([
  //         eventsService.getUniqueEventNames(),
  //         segmentationService.listSegments(),
  //       ]);
  //       setEvents(eventNames);
  //       setSegments(segmentList);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "Failed to fetch events and segments.",
  //       });
  //     }
  //   };
  //   fetchData();
  // }, []);

  if (!journeyDetails) {
    return <div>Loading...</div>; // Show while redirecting
  }

  const validateJourney = () => {
    // Check if there's at least one node besides the trigger and exit
    if (nodes.length <= 2) {
      toast({
        variant: "destructive",
        title: "Invalid Journey",
        description: "Your journey must have at least one action node.",
      });
      return false;
    }

    // Check if all nodes are connected
    const connectedNodeIds = new Set();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    if (connectedNodeIds.size !== nodes.length) {
      toast({
        variant: "destructive",
        title: "Invalid Journey",
        description: "All nodes must be connected in the journey.",
      });
      return false;
    }

    // Add more validation rules as needed

    return true;
  };

  const saveJourney = async () => {
    if (!validateJourney()) return;

    setIsSaving(true);
    try {
      const journeyData: CreateJourneyDTO = {
        name: journeyName,
        definition: {
          nodes: nodes.map(({ id, type, data }) => ({
            id,
            type: type as string,
            data,
          })),
          edges: edges,
        },
        runMultipleTimes: true, // You might want to make this configurable
      };

      await journeyManagementService.createJourney(journeyData);
      toast({
        title: "Success",
        description: "Journey saved successfully.",
      });
      router.push("/dashboard/journeys");
    } catch (error) {
      console.error("Error saving journey:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the journey. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNodePositions = useCallback((newNodes) => {
    const sortedNodes = newNodes.sort((a, b) => {
      if (a.type === "triggerNode") return -1;
      if (b.type === "triggerNode") return 1;
      if (a.type === "exitNode") return 1;
      if (b.type === "exitNode") return -1;
      return 0;
    });

    const centerX = 250;
    let currentY = 50;

    return sortedNodes.map((node, index) => {
      const updatedNode = {
        ...node,
        position: { x: centerX, y: currentY },
      };

      // Increase the Y position for the next node
      currentY += MIN_NODE_SPACING;

      return updatedNode;
    });
  }, []);

  const updateEdges = useCallback((updatedNodes) => {
    const newEdges = [];
    for (let i = 0; i < updatedNodes.length - 1; i++) {
      newEdges.push({
        id: `${updatedNodes[i].id}-${updatedNodes[i + 1].id}`,
        source: updatedNodes[i].id,
        target: updatedNodes[i + 1].id,
        type: "smoothstep",
      });
    }
    return newEdges;
  }, []);

  useEffect(() => {
    const initialNodes = [
      {
        id: "trigger",
        type: "triggerNode",
        position: { x: 250, y: 50 },
        data: { label: "Trigger" },
      },
      {
        id: "exit",
        type: "exitNode",
        position: { x: 250, y: 350 },
        data: { label: "Exit" },
      },
    ];

    const updatedNodes = updateNodePositions(initialNodes);
    const initialEdges = updateEdges(updatedNodes);

    setNodes(updatedNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges, updateNodePositions, updateEdges]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (type === "abTestNode") {
        toast({
          variant: "destructive",
          title: "Feature not available",
          description: "A/B Test node is coming soon!",
        });
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type.replace("Node", "")}` },
      };

      setNodes((nds) => {
        const updatedNodes = updateNodePositions([...nds, newNode]);
        setEdges(updateEdges(updatedNodes));
        return updateNodePositions(updatedNodes);
      });
    },
    [reactFlowInstance, setNodes, setEdges, updateNodePositions, updateEdges]
  );

  const onNodeDragStop = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = updateNodePositions(nds);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, updateNodePositions, updateEdges]);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const simulateJourney = () => {
    setIsSimulating(true);
    // Implement journey simulation logic here
    setTimeout(() => setIsSimulating(false), 3000); // Simulating for 3 seconds
  };

  // const saveJourney = () => {
  //   // Implement save logic here
  //   console.log("Saving journey:", { nodes, edges });
  //   router.push("/dashboard/journeys");
  // };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="bg-forest-500 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-meadow-500">Journey Builder</h1>
        <div className="flex items-center space-x-4">
          <Input
            value={journeyName}
            onChange={(e) => setJourneyName(e.target.value)}
            className="bg-forest-600 text-white border-meadow-500/50"
          />
          <span className="text-meadow-500 font-semibold">{journeyMode}</span>
        </div>
        <div className="space-x-4">
          <Button
            onClick={() => setShowSaveConfirmation(true)}
            className="bg-meadow-500 text-forest-800 hover:bg-meadow-400"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Journey"}
          </Button>
        </div>
      </div>
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls />
          <Background color="#e2e8f0" gap={20} />
          <Sidebar onDragStart={onDragStart} />
        </ReactFlow>
        {selectedNode && (
          <NodeProperties
            node={selectedNode}
            setNodes={setNodes}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
      <AlertDialog
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Journey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save this journey? Once saved, it will be
              created and live in your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveJourney}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const JourneyBuilder = () => (
  <ReactFlowProvider>
    <FlowWithProvider />
  </ReactFlowProvider>
);

export default JourneyBuilder;
