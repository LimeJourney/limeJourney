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
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJourneyContext } from "@/app/contexts/journeyContext";

const NodeWrapper = ({ children, icon: Icon, label, type }) => {
  const bgColor =
    {
      trigger: "bg-meadow-100",
      email: "bg-meadow-200",
      split: "bg-meadow-300",
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
        {data.description || "Journey Start"}
      </div>
      <div className="flex items-center justify-between text-forest-600 text-xs">
        <div className="flex items-center">
          <Info size={12} className="mr-1" />
          <span>Triggers: {data.triggerCount || 0}</span>
        </div>
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          <span>{data.frequency || "Not set"}</span>
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
  splitNode: SplitNode,
  exitNode: ExitNode,
  waitNode: WaitNode,
  actionNode: ActionNode,
};

const sidebarNodeTypes = [
  { type: "emailNode", label: "Email", icon: Mail },
  { type: "splitNode", label: "Split", icon: GitBranch },
  { type: "waitNode", label: "Wait", icon: Clock },
  { type: "actionNode", label: "Action", icon: Zap },
];

const Sidebar = ({ onDragStart }) => {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-4 bg-forest-500 p-4 shadow-lg rounded-lg z-10"
      style={{ width: "250px", maxHeight: "calc(100vh - 8rem)" }}
    >
      <h2 className="text-xl font-bold mb-4 text-meadow-500">Node Types</h2>
      <div className="space-y-2">
        {sidebarNodeTypes.map((node) => (
          <TooltipProvider key={node.type}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-meadow-500 text-forest-800 p-3 rounded cursor-move transition-all duration-300 hover:bg-meadow-400"
                  onDragStart={(event) => onDragStart(event, node.type)}
                  draggable
                >
                  <node.icon size={20} />
                  <span className="font-medium">{node.label}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Drag to add {node.label} node</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
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

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-[400px] bg-forest-500 text-white border-l border-meadow-500/20">
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
            {node.type === "emailNode" && (
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
                    onChange={(e) =>
                      updateNodeData("recipient", e.target.value)
                    }
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
            )}
            {/* Add more node-specific properties here */}
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

  const MIN_NODE_SPACING = 250; // Minimum vertical spacing between nodes

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
        return updatedNodes;
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

  const onAddNode = useCallback(
    (edgeId) => {
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;

      const newNode = {
        id: `emailNode-${Date.now()}`,
        type: "emailNode",
        position: { x: 0, y: 0 },
        data: { label: "New Email" },
      };

      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        return updateNodePositions(updatedNodes);
      });

      setEdges((eds) => {
        const newEdgeToTarget = {
          id: `${newNode.id}-${edge.target}`,
          source: newNode.id,
          target: edge.target,
          type: "smoothstep",
        };
        const updatedEdge = {
          ...edge,
          target: newNode.id,
        };
        return eds
          .map((e) => (e.id === edge.id ? updatedEdge : e))
          .concat(newEdgeToTarget);
      });
    },
    [edges, setNodes, setEdges, updateNodePositions]
  );

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

  if (!journeyDetails) {
    return <div>Loading...</div>; // Show while redirecting
  }

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const simulateJourney = () => {
    setIsSimulating(true);
    // Implement journey simulation logic here
    setTimeout(() => setIsSimulating(false), 3000); // Simulating for 3 seconds
  };

  const saveJourney = () => {
    // Implement save logic here
    console.log("Saving journey:", { nodes, edges });
    router.push("/dashboard/journeys");
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="bg-forest-500 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-meadow-500">Journey Builder</h1>
        <div className="flex items-center space-x-4">
          <Input
            value={journeyDetails.name}
            onChange={(e) =>
              setJourneyDetails({ ...journeyDetails, name: e.target.value })
            }
            className="bg-forest-600 text-white border-meadow-500/50"
          />
          <span className="text-meadow-500 font-semibold">{journeyMode}</span>
        </div>
        <div className="space-x-4">
          <Button
            onClick={simulateJourney}
            disabled={isSimulating}
            className="bg-meadow-500 text-forest-800 hover:bg-meadow-400"
          >
            {isSimulating ? "Simulating..." : "Simulate Journey"}
          </Button>
          <Button
            onClick={saveJourney}
            className="bg-meadow-500 text-forest-800 hover:bg-meadow-400"
          >
            <Save className="mr-2 h-4 w-4" /> Save Journey
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
          {/* <MiniMap style={{ backgroundColor: "hsl(188, 69%, 14%)" }} /> */}
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
    </div>
  );
};

const JourneyBuilder = () => (
  <ReactFlowProvider>
    <FlowWithProvider />
  </ReactFlowProvider>
);

export default JourneyBuilder;
