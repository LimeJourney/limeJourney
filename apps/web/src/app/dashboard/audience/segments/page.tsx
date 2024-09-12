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
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  SheetDescription,
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
  TimeUnit,
} from "@/services/segmentationService";
import { entityService } from "@/services/entitiesService";
import { eventsService } from "@/services/eventsService";

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
  const formatCriterion = (criterion: SegmentCriterion) => {
    return `${criterion.field} ${criterion.operator} ${criterion.value}`;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-forest-500 border-meadow-500/20">
        <CardHeader>
          <CardTitle className="text-meadow-500 text-lg">
            Segment Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pl-4">
            {conditions.map((condition, conditionIndex) => (
              <div key={conditionIndex} className="mb-4 last:mb-0">
                <div className="flex items-center mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-meadow-500/20 text-meadow-500 mr-2"
                  >
                    {conditionIndex === 0
                      ? "IF"
                      : conditions[0].logicalOperator}
                  </Badge>
                  <div className="text-white font-semibold">
                    Condition {conditionIndex + 1}
                  </div>
                </div>
                <div className="pl-4 border-l-2 border-meadow-500/30">
                  {condition.criteria.map((criterion, criterionIndex) => (
                    <div
                      key={criterionIndex}
                      className="flex items-center mb-2 last:mb-0"
                    >
                      <ChevronRight
                        className="text-meadow-500 mr-2"
                        size={16}
                      />
                      <Badge
                        variant="outline"
                        className="border-meadow-500/50 text-meadow-500 mr-2"
                      >
                        {criterionIndex === 0 ? "IF" : "AND"}
                      </Badge>
                      <span className="text-white">
                        {formatCriterion(criterion)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CriterionEditorProps {
  criterion: SegmentCondition["criteria"][0];
  onChange: (updatedCriterion: SegmentCondition["criteria"][0]) => void;
  onRemove: () => void;
  entityProperties: string[];
  eventNames: string[];
}

const CriterionEditor: React.FC<CriterionEditorProps> = ({
  criterion,
  onChange,
  onRemove,
  entityProperties,
  eventNames,
}) => {
  const allFields = [...entityProperties, ...eventNames];

  const operatorsRequiringTimeUnit = [
    SegmentOperator.HAS_DONE_WITHIN,
    SegmentOperator.HAS_NOT_DONE_WITHIN,
  ];

  const operatorsRequiringNumber = [
    SegmentOperator.GREATER_THAN,
    SegmentOperator.LESS_THAN,
    SegmentOperator.HAS_DONE_TIMES,
  ];

  const operatorsRequiringMultipleValues = [
    SegmentOperator.IN,
    SegmentOperator.NOT_IN,
    SegmentOperator.BETWEEN,
    SegmentOperator.NOT_BETWEEN,
  ];

  const needsTimeUnit = operatorsRequiringTimeUnit.includes(criterion.operator);
  const needsNumber = operatorsRequiringNumber.includes(criterion.operator);
  const needsMultipleValues = operatorsRequiringMultipleValues.includes(
    criterion.operator
  );

  const handleFieldChange = (value: string) => {
    const type = eventNames.includes(value)
      ? SegmentCriterionType.EVENT
      : SegmentCriterionType.PROPERTY;
    onChange({ ...criterion, field: value, type });
  };

  return (
    <div className="flex items-center space-x-2 mb-2">
      <Select value={criterion.field} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-48 bg-forest-600 text-white border-meadow-500/50">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent className="bg-forest-600 text-white border-meadow-500/50">
          {allFields.map((field) => (
            <SelectItem key={field} value={field}>
              {field}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={criterion.operator}
        onValueChange={(value) =>
          onChange({ ...criterion, operator: value as SegmentOperator })
        }
      >
        <SelectTrigger className="w-48 bg-forest-600 text-white border-meadow-500/50">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent className="bg-forest-600 text-white border-meadow-500/50">
          {Object.values(SegmentOperator).map((op) => (
            <SelectItem key={op} value={op}>
              {op.replace(/_/g, " ").toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsNumber ? (
        <Input
          type="number"
          value={criterion.value}
          onChange={(e) => onChange({ ...criterion, value: e.target.value })}
          placeholder="Enter number"
          className="w-32 bg-forest-600 text-white border-meadow-500/50"
        />
      ) : needsMultipleValues ? (
        <Input
          type="text"
          value={criterion.value}
          onChange={(e) => onChange({ ...criterion, value: e.target.value })}
          placeholder="Comma-separated values"
          className="w-48 bg-forest-600 text-white border-meadow-500/50"
        />
      ) : (
        <Input
          type="text"
          value={criterion.value}
          onChange={(e) => onChange({ ...criterion, value: e.target.value })}
          placeholder="Value"
          className="w-32 bg-forest-600 text-white border-meadow-500/50"
        />
      )}

      {needsTimeUnit && (
        <Select
          value={criterion.timeUnit}
          onValueChange={(value) =>
            onChange({ ...criterion, timeUnit: value as TimeUnit })
          }
        >
          <SelectTrigger className="w-20 h-8 text-xs bg-forest-600 text-white border-meadow-500/50">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent className="bg-forest-600 text-white border-meadow-500/50">
            {Object.values(TimeUnit).map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-meadow-500 hover:text-meadow-500/80 hover:bg-forest-500/50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ConditionEditor: React.FC<{
  conditions: SegmentCondition[];
  setConditions: (conditions: SegmentCondition[]) => void;
  entityProperties: string[];
  eventNames: string[];
}> = ({ conditions, setConditions, entityProperties, eventNames }) => {
  // Default dummy condition
  const defaultCondition: SegmentCondition = {
    criteria: [
      {
        type: SegmentCriterionType.PROPERTY,
        field: "default_field",
        operator: SegmentOperator.EQUALS,
        value: "default_value",
      },
    ],
    logicalOperator: LogicalOperator.AND,
  };

  // If conditions array is empty, initialize it with the default condition
  React.useEffect(() => {
    if (conditions.length === 0) {
      setConditions([defaultCondition]);
    }
  }, []);

  const addCondition = () => {
    setConditions([...conditions, defaultCondition]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (
    index: number,
    updatedCondition: SegmentCondition
  ) => {
    setConditions(
      conditions.map((c, i) => (i === index ? updatedCondition : c))
    );
  };

  const updateLogicalOperator = (operator: LogicalOperator) => {
    setConditions(conditions.map((c) => ({ ...c, logicalOperator: operator })));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-meadow-500">Conditions</h3>
        <Select
          onValueChange={updateLogicalOperator}
          defaultValue={conditions[0]?.logicalOperator}
        >
          <SelectTrigger className="w-[180px] bg-forest-500 text-white border-meadow-500/50">
            <SelectValue placeholder="Combine with..." />
          </SelectTrigger>
          <SelectContent className="bg-forest-500 text-white border-meadow-500/50">
            <SelectItem value={LogicalOperator.AND}>AND</SelectItem>
            <SelectItem value={LogicalOperator.OR}>OR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        {conditions.map((condition, index) => (
          <Card key={index} className="mb-4 bg-forest-500 border-meadow-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-meadow-500 text-sm font-medium">
                Condition {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
                className="text-meadow-500 hover:text-meadow-500/80 hover:bg-forest-500/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {condition.criteria.map((criterion, criterionIndex) => (
                <CriterionEditor
                  key={criterionIndex}
                  criterion={criterion}
                  onChange={(updatedCriterion) => {
                    const updatedCriteria = [...condition.criteria];
                    updatedCriteria[criterionIndex] = updatedCriterion;
                    updateCondition(index, {
                      ...condition,
                      criteria: updatedCriteria,
                    });
                  }}
                  onRemove={() => {
                    const updatedCriteria = condition.criteria.filter(
                      (_, i) => i !== criterionIndex
                    );
                    updateCondition(index, {
                      ...condition,
                      criteria: updatedCriteria,
                    });
                  }}
                  entityProperties={entityProperties}
                  eventNames={eventNames}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedCriteria = [
                    ...condition.criteria,
                    {
                      type: SegmentCriterionType.PROPERTY,
                      field: "",
                      operator: SegmentOperator.EQUALS,
                      value: "",
                    },
                  ];
                  updateCondition(index, {
                    ...condition,
                    criteria: updatedCriteria,
                  });
                }}
                className="w-full text-meadow-500 bg-meadow-500/10 border-meadow-500/50 hover:bg-meadow-700/10"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Criterion
              </Button>
            </CardFooter>
          </Card>
        ))}
      </ScrollArea>
      <Button
        onClick={addCondition}
        className="w-full bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
      </Button>
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
    <div className="flex flex-col items-center justify-center h-64 bg-forest-900 rounded-lg border border-neutral-700 p-8">
      <AlertCircle className="h-12 w-12 text-neutral-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">No segments yet</h2>
      <p className="text-neutral-400 text-center mb-6">
        Create your first segment to start organizing your users.
      </p>
      <Button
        onClick={onCreateSegment}
        className="bg-meadow-500 text-black hover:bg-meadow-500/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
      </Button>
    </div>
  );
};

const defaultConditionSets = {
  active_users: [
    {
      criteria: [
        {
          type: SegmentCriterionType.EVENT,
          field: "app_opened",
          operator: SegmentOperator.HAS_DONE_WITHIN,
          value: "30",
          timeUnit: TimeUnit.DAYS,
        },
      ],
      logicalOperator: LogicalOperator.AND,
    },
  ],
  high_value_customers: [
    {
      criteria: [
        {
          type: SegmentCriterionType.PROPERTY,
          field: "total_purchases",
          operator: SegmentOperator.GREATER_THAN,
          value: "1000",
        },
        {
          type: SegmentCriterionType.EVENT,
          field: "purchase",
          operator: SegmentOperator.HAS_DONE_WITHIN,
          value: "90",
          timeUnit: TimeUnit.DAYS,
        },
      ],
      logicalOperator: LogicalOperator.AND,
    },
  ],
  at_risk_users: [
    {
      criteria: [
        {
          type: SegmentCriterionType.EVENT,
          field: "app_opened",
          operator: SegmentOperator.HAS_NOT_DONE_WITHIN,
          value: "30",
          timeUnit: TimeUnit.DAYS,
        },
      ],
      logicalOperator: LogicalOperator.AND,
    },
  ],
};

const TwoPanelSegmentCreator: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreateOrUpdateSegment: (
    segment: CreateSegmentDTO | UpdateSegmentDTO
  ) => void;
  entityProperties: string[];
  eventNames: string[];
  editingSegment: Segment | null;
}> = ({
  isOpen,
  onClose,
  onCreateOrUpdateSegment,
  entityProperties,
  eventNames,
  editingSegment,
}) => {
  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");
  const [segmentTags, setSegmentTags] = useState("");
  const [segmentPurpose, setSegmentPurpose] = useState("");
  const [conditions, setConditions] = useState<SegmentCondition[]>([]);
  const [selectedDefaultSet, setSelectedDefaultSet] = useState<string>("");

  useEffect(() => {
    if (editingSegment) {
      setSegmentName(editingSegment.name);
      setSegmentDescription(editingSegment.description);
      // setSegmentTags(editingSegment.tags?.join(", ") || "");
      // setSegmentPurpose(editingSegment.purpose || "");
      setConditions(editingSegment.conditions);
    } else {
      resetForm();
    }
  }, [editingSegment]);

  const resetForm = () => {
    setSegmentName("");
    setSegmentDescription("");
    setSegmentTags("");
    setSegmentPurpose("");
    setConditions([]);
    setSelectedDefaultSet("");
  };

  const handleCreateOrUpdateSegment = () => {
    const segmentData = {
      name: segmentName,
      description: segmentDescription,
      tags: segmentTags.split(",").map((tag) => tag.trim()),
      purpose: segmentPurpose,
      conditions: conditions,
    };

    if (editingSegment) {
      onCreateOrUpdateSegment({ ...editingSegment, ...segmentData });
    } else {
      onCreateOrUpdateSegment(segmentData as CreateSegmentDTO);
    }
    onClose();
    resetForm();
  };

  const applyDefaultConditions = (setName: string) => {
    setConditions(
      defaultConditionSets[setName as keyof typeof defaultConditionSets]
    );
    setSelectedDefaultSet(setName);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-full sm:max-w-[1200px] p-0 bg-forest-500"
        side="right"
      >
        <div className="flex h-full">
          {/* Left Panel: Basic Information */}
          <div className="w-1/3 border-r border-meadow-500/20 p-6 flex flex-col">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-meadow-500 text-2xl">
                {editingSegment ? "Edit Segment" : "Create New Segment"}
              </SheetTitle>
              <SheetDescription className="text-white/70">
                Define your segment details and conditions
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-grow">
              <div className="space-y-4 pr-4">
                <div>
                  <Label htmlFor="segmentName" className="text-meadow-500">
                    Segment Name
                  </Label>
                  <Input
                    id="segmentName"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="bg-forest-500 text-white border-meadow-500/50 focus:border-meadow-500"
                    placeholder="Enter segment name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="segmentDescription"
                    className="text-meadow-500"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="segmentDescription"
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    className="bg-forest-500 text-white border-meadow-500/50 focus:border-meadow-500"
                    placeholder="Describe your segment"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="segmentTags" className="text-meadow-500">
                    Tags
                  </Label>
                  <Input
                    id="segmentTags"
                    value={segmentTags}
                    onChange={(e) => setSegmentTags(e.target.value)}
                    className="bg-forest-500 text-white border-meadow-500/50 focus:border-meadow-500"
                    placeholder="Enter tags, separated by commas"
                  />
                </div>
                <div>
                  <Label htmlFor="segmentPurpose" className="text-meadow-500">
                    Purpose
                  </Label>
                  <Textarea
                    id="segmentPurpose"
                    value={segmentPurpose}
                    onChange={(e) => setSegmentPurpose(e.target.value)}
                    className="bg-forest-500 text-white border-meadow-500/50 focus:border-meadow-500"
                    placeholder="What's the purpose of this segment?"
                    rows={3}
                  />
                </div>
              </div>
            </ScrollArea>
            <SheetFooter className="mt-6">
              <Button
                onClick={handleCreateOrUpdateSegment}
                className="w-full bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
              >
                {editingSegment ? "Update Segment" : "Create Segment"}
              </Button>
            </SheetFooter>
          </div>

          {/* Right Panel: Condition Editor and Visualizer */}
          <div className="w-2/3 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-meadow-500 mb-4">
              Define Conditions
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <Wand2 className="text-meadow-500" size={20} />
              <Select
                onValueChange={applyDefaultConditions}
                value={selectedDefaultSet}
              >
                <SelectTrigger className="w-[200px] bg-forest-500 text-white border-meadow-500/50">
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent className="bg-forest-500 text-white border-meadow-500/50">
                  <SelectItem value="active_users">Active Users</SelectItem>
                  <SelectItem value="high_value_customers">
                    High Value Customers
                  </SelectItem>
                  <SelectItem value="at_risk_users">At Risk Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="flex-grow">
              <div className="space-y-6 pr-4">
                <ConditionEditor
                  conditions={conditions}
                  setConditions={setConditions}
                  entityProperties={entityProperties}
                  eventNames={eventNames}
                />
                <h3 className="text-lg font-semibold text-meadow-500 mt-8 mb-4">
                  Condition Preview
                </h3>
                <ConditionVisualizer conditions={conditions} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SegmentDetailsView: React.FC<{
  segment: Segment;
  onClose: () => void;
  onEdit: () => void;
}> = ({ segment, onClose, onEdit }) => {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px] bg-forest-500 text-white border-l border-meadow-500/20">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-meadow-500">
            {segment.name}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                Description
              </h3>
              <p className="text-neutral-300">{segment.description}</p>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold mb-2 text-screaminGreen">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {segment.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-meadow-500/20 text-meadow-500">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-screaminGreen">Purpose</h3>
              <p className="text-neutral-300">{segment.purpose}</p>
            </div> */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-screaminGreen">
                Conditions
              </h3>
              <ConditionVisualizer conditions={segment.conditions} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold mb-1 text-screaminGreen">
                  Created
                </h3>
                <p className="text-neutral-300 text-sm">
                  {new Date(segment.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1 text-screaminGreen">
                  Updated
                </h3>
                <p className="text-neutral-300 text-sm">
                  {new Date(segment.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-6">
          <Button
            onClick={onEdit}
            className="w-full bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
          >
            Edit Segment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default function SegmentManagement() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [entityProperties, setEntityProperties] = useState<string[]>([]);
  const [eventNames, setEventNames] = useState<string[]>([]);
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
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [viewingSegment, setViewingSegment] = useState<Segment | null>(null);
  useEffect(() => {
    fetchSegments();
    fetchEntityProperties();
    fetchEventNames();
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

  const fetchEventNames = async () => {
    try {
      const names = await eventsService.getUniqueEventNames();
      setEventNames(names);
    } catch (error) {
      console.error("Failed to fetch event names:", error);
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

  const handleCreateOrUpdateSegment = async (
    segmentData: CreateSegmentDTO | UpdateSegmentDTO
  ) => {
    try {
      if ("id" in segmentData) {
        const updatedSegment = await segmentationService.updateSegment(
          segmentData.id,
          segmentData
        );
        setSegments(
          segments.map((s) => (s.id === updatedSegment.id ? updatedSegment : s))
        );
      } else {
        const createdSegment = await segmentationService.createSegment(
          segmentData as CreateSegmentDTO
        );
        setSegments([...segments, createdSegment]);
      }
      setIsCreateSheetOpen(false);
      setEditingSegment(null);
    } catch (error) {
      console.error("Failed to create/update segment:", error);
    }
  };

  return (
    <div className="px-8 py-6 bg-forest-700 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Segments</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-meadow-400" />
              <Input
                type="text"
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-forest-800 text-white border border-meadow-700 rounded-md focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent"
              />
            </div>
            <TwoPanelSegmentCreator
              isOpen={isCreateSheetOpen || !!editingSegment}
              onClose={() => {
                setIsCreateSheetOpen(false);
                setEditingSegment(null);
              }}
              onCreateOrUpdateSegment={handleCreateOrUpdateSegment}
              entityProperties={entityProperties}
              eventNames={eventNames}
              editingSegment={editingSegment}
            />

            <Button
              onClick={() => setIsCreateSheetOpen(true)}
              className="bg-meadow-500 text-forest-500 hover:bg-meadow-500/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
            </Button>
          </div>
        </div>
        <AIPoweredSegmentCreation onSegmentCreated={handleCreateSegment} />
        {segments.length === 0 ? (
          <EmptyState onCreateSegment={() => setIsCreateDialogOpen(true)} />
        ) : (
          <Card className="bg-forest-600 border-neutral-700">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-forest-700 border-meadow-muted">
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
                    className="hover:bg-forest-700 border-meadow-muted"
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
                          onClick={() => setEditingSegment(segment)}
                          className="text-neutral-300 hover:text-black hover:bg-meadow-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-neutral-300 hover:text-black hover:bg-meadow-700"
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingSegment(segment)}
                          className="text-neutral-300 hover:text-black hover:bg-meadow-700"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* {selectedSegment && (
          <Sheet
            open={!!selectedSegment}
            onOpenChange={() => setSelectedSegment(null)}
          >
            <SheetContent className="bg-forest-500 border-l border-neutral-700 w-full sm:max-w-xl overflow-hidden flex flex-col">
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
                      eventNames={eventNames}
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
        )} */}

        {viewingSegment && (
          <SegmentDetailsView
            segment={viewingSegment}
            onClose={() => setViewingSegment(null)}
            onEdit={() => {
              setEditingSegment(viewingSegment);
              setViewingSegment(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
