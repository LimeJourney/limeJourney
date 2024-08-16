"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  AlertCircle,
  Plus,
  X,
  Info,
  ChevronDown,
  Sparkles,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { create } from "domain";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mockAIProcessing = async (text) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate success or failure
  if (text.toLowerCase().includes("error")) {
    throw new Error(
      "Unable to process your request. Please try again with a different description."
    );
  }

  // Return mock conditions
  return [
    {
      criteria: [
        {
          type: "property",
          field: "age",
          operator: "greaterThan",
          value: "30",
        },
        {
          type: "property",
          field: "totalPurchases",
          operator: "greaterThan",
          value: "1000",
        },
      ],
      logicalOperator: "and",
    },
    {
      criteria: [
        {
          type: "property",
          field: "country",
          operator: "equals",
          value: "USA",
        },
      ],
      logicalOperator: "or",
    },
  ];
};

const AIPoweredSegmentCreation = ({ onSegmentCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedConditions, setGeneratedConditions] = useState(null);

  const handleAISegmentCreation = async () => {
    setIsProcessing(true);
    try {
      const conditions = await mockAIProcessing(aiInput);
      setGeneratedConditions(conditions);
    } catch (err) {
      console.error(err);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSegment = () => {
    onSegmentCreated({
      name: aiInput.split(" ").slice(0, 3).join(" "),
      description: aiInput,
      conditions: generatedConditions,
      createdBy: "AI",
    });
    setAiInput("");
    setGeneratedConditions(null);
    setIsExpanded(false);
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardContent className="p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI-Powered Segment Creation
              </h2>
              <p className="text-sm text-gray-600">
                Create segments effortlessly using natural language
              </p>
            </div>
          </div>
          <Button className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Try AI Segment Creation
              </>
            )}
          </Button>
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder="Describe your segment in natural language..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brightYellow focus:border-transparent placeholder-gray-500 transition-all duration-300"
              rows={4}
            />
            <Button
              onClick={handleAISegmentCreation}
              disabled={isProcessing || !aiInput.trim()}
              className="w-full bg-brightYellow/60 text-black hover:bg-black hover:text-white transition duration-300 ease-in-out font-semibold py-3 rounded-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Generate Segment"
              )}
            </Button>

            {generatedConditions && (
              <div className="space-y-4">
                <h3 className="text-black text-lg font-semibold">
                  Generated Conditions:
                </h3>
                <ConditionVisualizer conditions={generatedConditions} />
                <Button
                  onClick={handleConfirmSegment}
                  className="w-full bg-green-500 text-white hover:bg-green-600 transition duration-300 ease-in-out font-semibold py-3 rounded-lg"
                >
                  Confirm and Create Segment
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CustomDropdown = ({
  options,
  value,
  onValueChange,
  placeholder,
  width = "150px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" style={{ width }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock data
const mockSegments = [
  {
    id: "seg1",
    name: "High-Value Customers",
    description: "Customers with lifetime value over $1000",
    conditions: [
      {
        criteria: [
          {
            type: "property",
            field: "lifetimeValue",
            operator: "greaterThan",
            value: "1000",
          },
        ],
        logicalOperator: "and",
      },
    ],
    createdAt: "2024-08-13T10:30:00Z",
    updatedAt: "2024-08-13T10:30:00Z",
    createdBy: "AI",
  },
  {
    id: "seg2",
    name: "Recent Signups",
    description: "Users who signed up in the last 30 days",
    conditions: [
      {
        criteria: [
          {
            type: "property",
            field: "signupDate",
            operator: "greaterThan",
            value: "now-30d",
          },
        ],
        logicalOperator: "and",
      },
    ],
    createdAt: "2024-08-12T15:45:00Z",
    updatedAt: "2024-08-12T15:45:00Z",
    createdBy: "manual",
  },
  // Add more mock segments as needed
];

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Does not equal" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Does not contain" },
  { value: "greaterThan", label: "Greater than" },
  { value: "lessThan", label: "Less than" },
  { value: "in", label: "In" },
  { value: "notIn", label: "Not in" },
];

const PROPERTY_FIELDS = [
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
  { value: "age", label: "Age" },
  { value: "signupDate", label: "Signup Date" },
  { value: "lastPurchaseDate", label: "Last Purchase Date" },
  { value: "totalPurchases", label: "Total Purchases" },
  { value: "country", label: "Country" },
];

const ConditionVisualizer = ({ conditions }) => {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Condition Structure
      </h3>
      <div className="flex flex-col items-start">
        {conditions.map((condition, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-center">
              <div className="w-4 h-8 border-l-2 border-b-2 border-indigo-500 mr-2"></div>
              <div className="bg-indigo-50 p-2 rounded-md">
                <span className="text-indigo-700 font-medium">
                  Condition {index + 1}
                </span>
                <span className="text-indigo-500 ml-2">
                  ({condition.logicalOperator.toUpperCase()})
                </span>
              </div>
            </div>
            <div className="ml-6">
              {condition.criteria.map((criterion, cIndex) => (
                <div key={cIndex} className="flex items-center mt-2">
                  <div className="w-4 h-8 border-l-2 border-b-2 border-gray-300 mr-2"></div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-600">
                      {criterion.field} {criterion.operator} {criterion.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConditionEditor = ({ conditions, setConditions }) => {
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        criteria: [{ type: "property", field: "", operator: "", value: "" }],
        logicalOperator: "and",
      },
    ]);
  };

  const removeCondition = (index) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const addCriterion = (conditionIndex) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria.push({
      type: "property",
      field: "",
      operator: "",
      value: "",
    });
    setConditions(newConditions);
  };

  const removeCriterion = (conditionIndex, criterionIndex) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria.splice(criterionIndex, 1);
    setConditions(newConditions);
  };

  const updateCriterion = (conditionIndex, criterionIndex, field, value) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria[criterionIndex][field] = value;
    setConditions(newConditions);
  };

  const updateLogicalOperator = (conditionIndex, value) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].logicalOperator = value;
    setConditions(newConditions);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Info className="mr-2 h-5 w-5" />
            How to use the Condition Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">
            Create complex segment conditions by adding multiple conditions and
            criteria. Each condition can have multiple criteria joined by AND or
            OR operators. Use the visual representation below to understand how
            your conditions are structured.
          </p>
        </CardContent>
      </Card>

      {conditions.map((condition, conditionIndex) => (
        <Card key={conditionIndex} className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-indigo-700 text-sm font-medium">
              Condition {conditionIndex + 1}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(conditionIndex)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove this condition</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {condition.criteria.map((criterion, criterionIndex) => (
                <div
                  key={criterionIndex}
                  className="flex items-center space-x-2"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-[150px]">
                          <CustomDropdown
                            options={PROPERTY_FIELDS}
                            value={criterion.field}
                            onValueChange={(value) =>
                              updateCriterion(
                                conditionIndex,
                                criterionIndex,
                                "field",
                                value
                              )
                            }
                            placeholder="Select property"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the property to filter on</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {criterion.field && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-[150px]">
                            <CustomDropdown
                              options={OPERATORS}
                              value={criterion.operator}
                              onValueChange={(value) =>
                                updateCriterion(
                                  conditionIndex,
                                  criterionIndex,
                                  "operator",
                                  value
                                )
                              }
                              placeholder="Select operator"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose how to compare the property</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {criterion.field && criterion.operator && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            placeholder="Value"
                            value={criterion.value}
                            onChange={(e) =>
                              updateCriterion(
                                conditionIndex,
                                criterionIndex,
                                "value",
                                e.target.value
                              )
                            }
                            className="bg-white border-gray-300 text-gray-700"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the value to compare against</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeCriterion(conditionIndex, criterionIndex)
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove this criterion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCriterion(conditionIndex)}
                        className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Criterion
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new criterion to this condition</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-[80px]">
                        <CustomDropdown
                          options={[
                            { value: "and", label: "AND" },
                            { value: "or", label: "OR" },
                          ]}
                          value={condition.logicalOperator}
                          onValueChange={(value) =>
                            updateLogicalOperator(conditionIndex, value)
                          }
                          placeholder="Combine with"
                          width="80px"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Choose how to combine criteria within this condition
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={addCondition}
              className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Condition
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new condition to your segment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ConditionVisualizer conditions={conditions} />
    </div>
  );
};

export default function SegmentManagement() {
  const [segments, setSegments] = useState(mockSegments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAICreationOpen, setIsAICreationOpen] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    conditions: [
      {
        criteria: [{ type: "property", field: "", operator: "", value: "" }],
        logicalOperator: "and",
      },
    ],
  });

  const filteredSegments = segments.filter(
    (segment) =>
      segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSegment = (newSegment) => {
    const createdSegment = {
      ...newSegment,
      id: `seg${segments.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSegments([...segments, createdSegment]);
    setIsCreateDialogOpen(false);
    setNewSegment({ name: "", description: "", conditions: [] });
  };

  const handleDeleteSegment = (segmentId: string) => {
    setSegments(segments.filter((segment) => segment.id !== segmentId));
  };

  const handleUpdateSegment = (updatedSegment: any) => {
    setSegments(
      segments.map((segment) =>
        segment.id === updatedSegment.id
          ? { ...updatedSegment, updatedAt: new Date().toISOString() }
          : segment
      )
    );
    setSelectedSegment(null);
  };

  return (
    <div className="px-8 py-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Segments</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent"
              />
            </div>
            <Sheet
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <SheetTrigger asChild>
                <Button className="bg-brightYellow text-black hover:bg-brightYellow/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-neutral-900 border-l border-neutral-700 w-full sm:max-w-xl overflow-hidden flex flex-col">
                <SheetHeader>
                  <SheetTitle className="text-white text-2xl">
                    Create New Segment
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-grow overflow-auto py-4">
                  <div className="grid gap-6 pr-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className=" text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newSegment.name}
                        onChange={(e) =>
                          setNewSegment({ ...newSegment, name: e.target.value })
                        }
                        className="bg-neutral-800 text-white border-neutral-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newSegment.description}
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            description: e.target.value,
                          })
                        }
                        className="bg-neutral-800 text-white border-neutral-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Conditions</Label>
                      <ConditionEditor
                        conditions={newSegment.conditions}
                        setConditions={(conditions) =>
                          setNewSegment({ ...newSegment, conditions })
                        }
                      />
                    </div>
                  </div>
                </ScrollArea>
                <SheetFooter className="mt-4">
                  <Button
                    onClick={handleCreateSegment}
                    className="bg-brightYellow text-black hover:bg-brightYellow/90"
                  >
                    Create Segment
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI-Powered Segment Creation
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create segments effortlessly using natural language
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsAICreationOpen(!isAICreationOpen)}
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              >
                {isAICreationOpen ? "Close" : "Try AI Segment Creation"}
              </Button>
            </div>
            {isAICreationOpen && (
              <div className="mt-4">
                <AISegmentCreation onSegmentCreated={() => {}} />
              </div>
            )}
          </CardContent>
        </Card> */}
        <AIPoweredSegmentCreation onSegmentCreated={handleCreateSegment} />
        <Card className="bg-neutral-900 border-neutral-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-neutral-800 border-neutral-700">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Updated</TableHead>
                <TableHead className="text-white">Created By</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSegments.map((segment) => (
                <TableRow
                  key={segment.id}
                  className="hover:bg-neutral-800 border-neutral-700"
                >
                  <TableCell className="font-medium text-white">
                    {segment.name}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {segment.description}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {new Date(segment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {new Date(segment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {segment.createdBy === "AI" ? (
                      <Badge
                        variant="secondary"
                        className="bg-brightYellow text-black"
                      >
                        AI Generated
                      </Badge>
                    ) : (
                      "Manual"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSegment(segment)}
                        className="text-neutral-300 hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSegment(segment.id)}
                        className="text-neutral-300 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-300 hover:text-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700">
                          <SheetHeader>
                            <SheetTitle className="text-white text-2xl font-bold">
                              Segment Details
                            </SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-2 text-brightYellow">
                                Name
                              </h3>
                              <p className="text-neutral-300">{segment.name}</p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2 text-brightYellow">
                                Description
                              </h3>
                              <p className="text-neutral-300">
                                {segment.description}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2 text-brightYellow">
                                Conditions
                              </h3>
                              {segment.conditions.map((condition, index) => (
                                <div
                                  key={index}
                                  className="bg-neutral-800 p-4 rounded-md mb-4"
                                >
                                  <h4 className="font-semibold mb-2 text-white">
                                    Condition {index + 1}
                                  </h4>
                                  <p className="text-neutral-300">
                                    Logical Operator:{" "}
                                    {condition.logicalOperator}
                                  </p>
                                  <ul className="list-disc list-inside mt-2">
                                    {condition.criteria.map(
                                      (criterion, cIndex) => (
                                        <li
                                          key={cIndex}
                                          className="text-neutral-300"
                                        >
                                          {criterion.field} {criterion.operator}{" "}
                                          {criterion.value}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-semibold mb-2 text-brightYellow">
                                  Created
                                </h3>
                                <p className="text-neutral-300">
                                  {new Date(segment.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2 text-brightYellow">
                                  Updated
                                </h3>
                                <p className="text-neutral-300">
                                  {new Date(segment.updatedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {selectedSegment && (
          <Sheet
            open={!!selectedSegment}
            onOpenChange={() => setSelectedSegment(null)}
          >
            <SheetContent className="bg-neutral-900 border-l border-neutral-700 w-full sm:max-w-xl overflow-hidden flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-white">Edit Segment</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-grow overflow-auto py-4">
                <div className="grid gap-6 pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-white">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={selectedSegment.name}
                      onChange={(e) =>
                        setSelectedSegment({
                          ...selectedSegment,
                          name: e.target.value,
                        })
                      }
                      className="bg-neutral-800 text-white border-neutral-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={selectedSegment.description}
                      onChange={(e) =>
                        setSelectedSegment({
                          ...selectedSegment,
                          description: e.target.value,
                        })
                      }
                      className="bg-neutral-800 text-white border-neutral-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Conditions</Label>
                    <ConditionEditor
                      conditions={selectedSegment.conditions}
                      setConditions={(conditions) =>
                        setSelectedSegment({ ...selectedSegment, conditions })
                      }
                    />
                  </div>
                </div>
              </ScrollArea>
              <SheetFooter className="mt-4">
                <Button
                  onClick={() => handleUpdateSegment(selectedSegment)}
                  className="bg-brightYellow text-black hover:bg-brightYellow/90 w-full"
                >
                  Update Segment
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}