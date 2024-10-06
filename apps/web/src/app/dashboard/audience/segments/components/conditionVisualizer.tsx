import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  SegmentCondition,
  SegmentCriterion,
} from "@/services/segmentationService";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export default ConditionVisualizer;
