import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

const WaitNodeForm = ({ node, updateNodeData }) => {
  const [waitType, setWaitType] = useState("duration");
  const [duration, setDuration] = useState(1);
  const [timeUnit, setTimeUnit] = useState("minutes");
  const [specificDate, setSpecificDate] = useState("");

  const handleDurationChange = (value) => {
    setDuration(value);
    updateNodeData("duration", value);
    updateNodeData("timeUnit", timeUnit);
    updateNodeData("waitType", "duration");
  };

  const handleTimeUnitChange = (value) => {
    setTimeUnit(value);
    updateNodeData("timeUnit", value);
  };

  const handleSpecificDateChange = (value) => {
    setSpecificDate(value);
    updateNodeData("specificDate", value);
  };

  const handleWaitTypeChange = (value) => {
    setWaitType(value);
    updateNodeData("waitType", value);
  };

  return (
    <Card className="w-full h-full bg-forest-500 text-white shadow-lg border border-meadow-700">
      <CardHeader>
        <CardDescription className="text-meadow-200">
          <Clock className="mr-2" />
          Set the duration or specific time to wait before proceeding to the
          next step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={waitType}
          onValueChange={handleWaitTypeChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-forest-800">
            <TabsTrigger
              value="duration"
              className="data-[state=active]:bg-meadow-700"
            >
              Duration
            </TabsTrigger>
            <TabsTrigger
              value="specificDate"
              className="data-[state=active]:bg-meadow-700"
            >
              Date
            </TabsTrigger>
          </TabsList>
          <TabsContent value="duration">
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label
                    htmlFor="duration"
                    className="text-meadow-300 mb-2 block text-lg"
                  >
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="timeUnit"
                    className="text-meadow-300 mb-2 block text-lg"
                  >
                    Time Unit
                  </Label>
                  <Select onValueChange={handleTimeUnitChange} value={timeUnit}>
                    <SelectTrigger
                      id="timeUnit"
                      className="w-full bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                    >
                      <SelectValue placeholder="Select time unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-forest-800 border-forest-700">
                      <SelectItem
                        value="seconds"
                        className="text-white hover:bg-forest-700"
                      >
                        Seconds
                      </SelectItem>
                      <SelectItem
                        value="minutes"
                        className="text-white hover:bg-forest-700"
                      >
                        Minutes
                      </SelectItem>
                      <SelectItem
                        value="hours"
                        className="text-white hover:bg-forest-700"
                      >
                        Hours
                      </SelectItem>
                      <SelectItem
                        value="days"
                        className="text-white hover:bg-forest-700"
                      >
                        Days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-forest-600 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                  Wait Summary
                </h3>
                <p className="text-lg">
                  The workflow will wait for {duration} {timeUnit} before
                  proceeding to the next step.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="specificDate">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="specificDate"
                  className="text-meadow-300 mb-2 block text-lg"
                >
                  Select Date and Time
                </Label>
                <Input
                  id="specificDate"
                  type="datetime-local"
                  value={specificDate}
                  onChange={(e) => handleSpecificDateChange(e.target.value)}
                  className="bg-forest-800 border-forest-700 focus:ring-meadow-500 text-white"
                />
              </div>
              {specificDate && (
                <div className="bg-forest-600 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                    Wait Summary
                  </h3>
                  <p className="text-lg">
                    The workflow will wait until{" "}
                    {format(new Date(specificDate), "PPpp")} before proceeding
                    to the next step.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WaitNodeForm;
