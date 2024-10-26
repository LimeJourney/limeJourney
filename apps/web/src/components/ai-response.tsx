import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIResponseProps {
  insight: string;
  confidence: number;
  onCopy?: () => void;
  onFeedback?: (isPositive: boolean) => void;
}

const AIResponse: React.FC<AIResponseProps> = ({
  insight,
  confidence,
  onCopy = () => {},
  onFeedback = () => {},
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500/10 text-green-500";
    if (confidence >= 0.7) return "bg-yellow-500/10 text-yellow-500";
    return "bg-red-500/10 text-red-500";
  };

  return (
    <Card className="bg-forest-700/50 border-meadow-500/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-meadow-500 flex items-center text-lg">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Response
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className={`${getConfidenceColor(confidence)} ml-2`}
              >
                {(confidence * 100).toFixed(0)}% Confidence
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI's confidence level in this response</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-white/90 leading-relaxed">{insight}</p>

          <div className="flex items-center justify-between pt-4 border-t border-forest-600">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                onClick={() => onCopy()}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <p className="text-sm text-white/60 mr-2">Was this helpful?</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                      onClick={() => onFeedback(true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This was helpful</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                      onClick={() => onFeedback(false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This needs improvement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
