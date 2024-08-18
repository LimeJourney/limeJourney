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
  DialogDescription,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import segmentationService, {
  Segment,
  SegmentCondition,
  SegmentCriterion,
  SegmentCriterionType,
  SegmentOperator,
  LogicalOperator,
  CreateSegmentDTO,
  UpdateSegmentDTO,
} from "@/services/segmentationService";
import { entityService } from "@/services/entitiesService";

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  width?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  width = "150px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

const ConditionVisualizer: React.FC<{ conditions: SegmentCondition[] }> = ({
  conditions,
}) => {
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

const ConditionEditor: React.FC<{
  conditions: SegmentCondition[];
  setConditions: (conditions: SegmentCondition[]) => void;
  entityProperties: string[];
}> = ({ conditions, setConditions, entityProperties }) => {
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        criteria: [
          {
            type: SegmentCriterionType.PROPERTY,
            field: "",
            operator: SegmentOperator.EQUALS,
            value: "",
          },
        ],
        logicalOperator: LogicalOperator.AND,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const addCriterion = (conditionIndex: number) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria.push({
      type: SegmentCriterionType.PROPERTY,
      field: "",
      operator: SegmentOperator.EQUALS,
      value: "",
    });
    setConditions(newConditions);
  };

  const removeCriterion = (conditionIndex: number, criterionIndex: number) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria.splice(criterionIndex, 1);
    setConditions(newConditions);
  };

  const updateCriterion = (
    conditionIndex: number,
    criterionIndex: number,
    field: keyof SegmentCriterion,
    value: any
  ) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].criteria[criterionIndex][field] = value;
    setConditions(newConditions);
  };

  const updateLogicalOperator = (
    conditionIndex: number,
    value: LogicalOperator
  ) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].logicalOperator = value;
    setConditions(newConditions);
  };

  const PROPERTY_FIELDS = entityProperties.map((prop: string) => ({
    value: prop,
    label: prop.charAt(0).toUpperCase() + prop.slice(1), // Capitalize first letter
  }));

  const OPERATORS = [
    { value: SegmentOperator.EQUALS, label: "Equals" },
    { value: SegmentOperator.NOT_EQUALS, label: "Does not equal" },
    { value: SegmentOperator.CONTAINS, label: "Contains" },
    { value: SegmentOperator.NOT_CONTAINS, label: "Does not contain" },
    { value: SegmentOperator.GREATER_THAN, label: "Greater than" },
    { value: SegmentOperator.LESS_THAN, label: "Less than" },
    { value: SegmentOperator.IN, label: "In" },
    { value: SegmentOperator.NOT_IN, label: "Not in" },
  ];

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
                                  value as SegmentOperator
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
                            value={criterion.value as string}
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
                            { value: LogicalOperator.AND, label: "AND" },
                            { value: LogicalOperator.OR, label: "OR" },
                          ]}
                          value={condition.logicalOperator}
                          onValueChange={(value) =>
                            updateLogicalOperator(
                              conditionIndex,
                              value as LogicalOperator
                            )
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

const AIPoweredSegmentCreation: React.FC<{
  onSegmentCreated: (segment: CreateSegmentDTO) => void;
}> = ({ onSegmentCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedConditions, setGeneratedConditions] = useState<
    SegmentCondition[] | null
  >(null);

  const handleAISegmentCreation = async () => {
    setIsProcessing(true);
    try {
      // Simulated AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const conditions: SegmentCondition[] = [
        {
          criteria: [
            {
              type: SegmentCriterionType.PROPERTY,
              field: "age",
              operator: SegmentOperator.GREATER_THAN,
              value: "30",
            },
            {
              type: SegmentCriterionType.PROPERTY,
              field: "totalPurchases",
              operator: SegmentOperator.GREATER_THAN,
              value: "1000",
            },
          ],
          logicalOperator: LogicalOperator.AND,
        },
        {
          criteria: [
            {
              type: SegmentCriterionType.PROPERTY,
              field: "country",
              operator: SegmentOperator.EQUALS,
              value: "USA",
            },
          ],
          logicalOperator: LogicalOperator.OR,
        },
      ];
      setGeneratedConditions(conditions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSegment = () => {
    if (generatedConditions) {
      onSegmentCreated({
        name: aiInput.split(" ").slice(0, 3).join(" "),
        description: aiInput,
        conditions: generatedConditions,
      });
      setAiInput("");
      setGeneratedConditions(null);
      setIsExpanded(false);
    }
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
              className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-screaminGreen focus:border-transparent placeholder-gray-500 transition-all duration-300"
              rows={4}
            />
            <Button
              onClick={handleAISegmentCreation}
              disabled={isProcessing || !aiInput.trim()}
              className="w-full bg-screaminGreen/60 text-black hover:bg-black hover:text-white transition duration-300 ease-in-out font-semibold py-3 rounded-lg"
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

const EmptyState: React.FC<{ onCreateSegment: () => void }> = ({
  onCreateSegment,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-neutral-900 rounded-lg border border-neutral-700 p-8">
      <AlertCircle className="h-12 w-12 text-neutral-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">No segments yet</h2>
      <p className="text-neutral-400 text-center mb-6">
        Create your first segment to start organizing your users.
      </p>
      <Button
        onClick={onCreateSegment}
        className="bg-screaminGreen text-black hover:bg-screaminGreen/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
      </Button>
    </div>
  );
};

export default function SegmentManagement() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [entityProperties, setEntityProperties] = useState<string[]>([]);
  const [newSegment, setNewSegment] = useState<CreateSegmentDTO>({
    name: "",
    description: "",
    conditions: [
      {
        criteria: [
          {
            type: SegmentCriterionType.PROPERTY,
            field: "",
            operator: SegmentOperator.EQUALS,
            value: "",
          },
        ],
        logicalOperator: LogicalOperator.AND,
      },
    ],
  });

  useEffect(() => {
    fetchSegments();
    fetchEntityProperties();
  }, []);

  const fetchSegments = async () => {
    try {
      const fetchedSegments = await segmentationService.listSegments();
      setSegments(fetchedSegments);
    } catch (error) {
      console.error("Failed to fetch segments:", error);
    }
  };

  const fetchEntityProperties = async () => {
    try {
      const properties = await entityService.getEntityProperties();
      setEntityProperties(properties);
    } catch (error) {
      console.error("Failed to fetch entity properties:", error);
    }
  };

  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await segmentationService.deleteSegment(segmentId);
      setSegments(segments.filter((segment) => segment.id !== segmentId));
      setSegmentToDelete(null);
    } catch (error) {
      console.error("Failed to delete segment:", error);
    }
  };

  const filteredSegments = segments.filter(
    (segment) =>
      segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSegment = async (newSegment: CreateSegmentDTO) => {
    try {
      const createdSegment =
        await segmentationService.createSegment(newSegment);
      setSegments([...segments, createdSegment]);
      setIsCreateDialogOpen(false);
      setNewSegment({
        name: "",
        description: "",
        conditions: [
          {
            criteria: [
              {
                type: SegmentCriterionType.PROPERTY,
                field: "",
                operator: SegmentOperator.EQUALS,
                value: "",
              },
            ],
            logicalOperator: LogicalOperator.AND,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to create segment:", error);
    }
  };

  const handleUpdateSegment = async (updatedSegment: Segment) => {
    try {
      const updated = await segmentationService.updateSegment(
        updatedSegment.id,
        {
          name: updatedSegment.name,
          description: updatedSegment.description,
          conditions: updatedSegment.conditions,
        }
      );
      setSegments(
        segments.map((segment) =>
          segment.id === updated.id ? updated : segment
        )
      );
      setSelectedSegment(null);
    } catch (error) {
      console.error("Failed to update segment:", error);
    }
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
                className="pl-10 pr-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-screaminGreen focus:border-transparent"
              />
            </div>
            <Sheet
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <SheetTrigger asChild>
                <Button className="bg-screaminGreen text-black hover:bg-screaminGreen/90">
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
                      <Label htmlFor="name" className="text-white">
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
                        entityProperties={entityProperties}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <SheetFooter className="mt-4">
                  <Button
                    onClick={() => handleCreateSegment(newSegment)}
                    className="bg-screaminGreen text-black hover:bg-screaminGreen/90"
                  >
                    Create Segment
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <AIPoweredSegmentCreation onSegmentCreated={handleCreateSegment} />
        {segments.length === 0 ? (
          <EmptyState onCreateSegment={() => setIsCreateDialogOpen(true)} />
        ) : (
          <Card className="bg-neutral-900 border-neutral-700">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-neutral-800 border-neutral-700">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                  <TableHead className="text-white">Created</TableHead>
                  <TableHead className="text-white">Updated</TableHead>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-neutral-300 hover:text-white"
                              onClick={() => setSegmentToDelete(segment)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-neutral-900 border border-neutral-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Confirm Deletion
                              </DialogTitle>
                              <DialogDescription className="text-neutral-300">
                                Are you sure you want to delete the segment "
                                {segmentToDelete?.name}"? This action cannot be
                                undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setSegmentToDelete(null)}
                                className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  segmentToDelete &&
                                  handleDeleteSegment(segmentToDelete.id)
                                }
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
                                <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                                  Name
                                </h3>
                                <p className="text-neutral-300">
                                  {segment.name}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                                  Description
                                </h3>
                                <p className="text-neutral-300">
                                  {segment.description}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                                  Conditions
                                </h3>
                                <ConditionVisualizer
                                  conditions={segment.conditions}
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                                    Created
                                  </h3>
                                  <p className="text-neutral-300">
                                    {new Date(
                                      segment.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                                    Updated
                                  </h3>
                                  <p className="text-neutral-300">
                                    {new Date(
                                      segment.updatedAt
                                    ).toLocaleString()}
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
        )}

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
                      entityProperties={entityProperties}
                    />
                  </div>
                </div>
              </ScrollArea>
              <SheetFooter className="mt-4">
                <Button
                  onClick={() => handleUpdateSegment(selectedSegment)}
                  className="bg-screaminGreen text-black hover:bg-screaminGreen/90 w-full"
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
