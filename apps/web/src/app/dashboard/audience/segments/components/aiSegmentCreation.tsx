import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CreateSegmentDTO,
  SegmentCondition,
} from "@/services/segmentationService";
import { Sparkles, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ConditionVisualizer from "../components/conditionVisualizer";
import segmentationService from "@/services/segmentationService";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";

interface GeneratedSegment {
  title: string;
  description: string;
  conditions: SegmentCondition[];
}

const AIPoweredSegmentCreation: React.FC<{
  onSegmentCreated: (segment: CreateSegmentDTO) => void;
}> = ({ onSegmentCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedSegment, setGeneratedSegment] =
    useState<GeneratedSegment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useSubscriptionCheck();
  const handleAISegmentCreation = async () => {
    const isSubscribed = await checkSubscription();
    if (isSubscribed) {
      setIsProcessing(true);
      setError(null);
      try {
        const response =
          await segmentationService.generateSegmentFromNaturalLanguage(aiInput);
        setGeneratedSegment(response);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while generating the segment."
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConfirmSegment = () => {
    if (generatedSegment) {
      onSegmentCreated({
        name: generatedSegment.title,
        description: generatedSegment.description,
        conditions: generatedSegment.conditions,
      });
      setAiInput("");
      setGeneratedSegment(null);
      setIsExpanded(false);
      setError(null);
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
              className="w-full bg-forest-500 text-meadow-500 hover:bg-black hover:text-white transition duration-300 ease-in-out font-semibold py-3 rounded-lg"
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

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {generatedSegment && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Segment Title
                  </label>
                  <Input
                    value={generatedSegment.title}
                    onChange={(e) =>
                      setGeneratedSegment({
                        ...generatedSegment,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Segment Description
                  </label>
                  <Textarea
                    value={generatedSegment.description}
                    onChange={(e) =>
                      setGeneratedSegment({
                        ...generatedSegment,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <h3 className="text-black text-lg font-semibold">
                  Generated Conditions:
                </h3>
                <ConditionVisualizer conditions={generatedSegment.conditions} />
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

export default AIPoweredSegmentCreation;
