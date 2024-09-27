"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Play,
  Pause,
  BarChart2,
  Eye,
  Filter,
  ChevronDown,
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Settings,
  Zap,
  UserCircle,
  LineChart,
  PieChart,
  BarChart,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useJourneyContext } from "@/app/contexts/journeyContext";
import {
  journeyManagementService,
  JourneyMetrics,
  JourneyActivity,
  Journey,
  JourneyStatus,
  TriggerInfo,
  JourneyWithMetrics,
} from "@/services/journeyService";

const JourneyManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(false);
  const [newJourneyName, setNewJourneyName] = useState("");
  const [newJourneyRepeatOption, setNewJourneyRepeatOption] = useState("once");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [journeyToDelete, setJourneyToDelete] =
    useState<JourneyWithMetrics | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [journeyToChangeStatus, setJourneyToChangeStatus] =
    useState<JourneyWithMetrics | null>(null);
  const [journeys, setJourneys] = useState<JourneyWithMetrics[] | []>([]);
  const [journeyMetrics, setJourneyMetrics] = useState<JourneyMetrics | null>(
    null
  );
  const [recentActivities, setRecentActivities] = useState<JourneyActivity[]>(
    []
  );
  const router = useRouter();
  const { setNewJourneyDetails } = useJourneyContext();

  useEffect(() => {
    fetchJourneys();
  }, [activeTab]);

  const fetchJourneys = async () => {
    try {
      const status =
        activeTab !== "all"
          ? (activeTab.toUpperCase() as JourneyStatus)
          : undefined;
      const fetchedJourneys =
        await journeyManagementService.listJourneys(status);
      setJourneys(fetchedJourneys);
    } catch (error) {
      console.error("Error fetching journeys:", error);
    }
  };

  const extractTriggerInfo = (journey: Journey): TriggerInfo => {
    const triggerNode = journey.definition.nodes.find(
      (node) => node.type === "triggerNode"
    );
    if (triggerNode && triggerNode.data.triggerType) {
      return {
        type: triggerNode.data.triggerType as "event" | "segment" | null,
        name:
          triggerNode.data.triggerType === "segment"
            ? (triggerNode.data.segmentAction as string) || "Segment"
            : "Event Triggered",
      };
    }
    return { type: null, name: null };
  };

  const fetchJourneyMetrics = async (journeyId: string) => {
    try {
      const metrics =
        await journeyManagementService.getJourneyMetrics(journeyId);
      setJourneyMetrics(metrics);
    } catch (error) {
      console.error("Error fetching journey metrics:", error);
    }
  };

  const fetchRecentActivities = async (journeyId: string) => {
    try {
      const activities =
        await journeyManagementService.getRecentJourneyActivity(journeyId, 5);
      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  const createJourney = async () => {
    try {
      // const newJourney = await journeyManagementService.createJourney({
      //   name: newJourneyName,
      //   runMultipleTimes: newJourneyRepeatOption === "multiple",
      //   definition: { nodes: [], edges: [] }, // Initialize with empty definition
      // });
      setNewJourneyDetails({
        name: newJourneyName,
        repeatOption: newJourneyRepeatOption,
      });
      router.push(`/dashboard/journeys/builder`);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (journeyToDelete) {
      try {
        await journeyManagementService.updateJourney(journeyToDelete.id, {
          status: "ARCHIVED",
        });
        setJourneys(
          journeys.filter((journey) => journey.id !== journeyToDelete.id)
        );
        setDeleteDialogOpen(false);
        setJourneyToDelete(null);
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    }
  };

  const handleStatusChangeConfirm = async () => {
    if (journeyToChangeStatus) {
      const newStatus: JourneyStatus =
        journeyToChangeStatus.status === JourneyStatus.ACTIVE
          ? JourneyStatus.PAUSED
          : ("ACTIVE" as JourneyStatus);
      try {
        await journeyManagementService.updateJourney(journeyToChangeStatus.id, {
          status: newStatus,
        });
        setJourneys(
          journeys.map((journey) =>
            journey.id === journeyToChangeStatus.id
              ? { ...journey, status: newStatus }
              : journey
          )
        );
        setStatusChangeDialogOpen(false);
        setJourneyToChangeStatus(null);
      } catch (error) {
        console.error("Error changing journey status:", error);
      }
    }
  };

  const filteredJourneys = journeys.filter(
    (journey) =>
      journey.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "all" || journey.status.toLowerCase() === activeTab)
  );

  console.log("Filtered Journeys", filteredJourneys);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-500", icon: CheckCircle },
      PAUSED: { color: "bg-yellow-500", icon: Pause },
      DRAFT: { color: "bg-blue-500", icon: Edit2 },
    };
    const { color, icon: Icon } = statusConfig[status] || {};

    return (
      <Badge variant="outline" className={`${color} text-forest-500`}>
        <Icon size={12} className="mr-1" />
        <span className="capitalize">{status.toLowerCase()}</span>
      </Badge>
    );
  };

  const TriggerBadge: React.FC<{ trigger: TriggerInfo }> = ({ trigger }) => {
    if (!trigger.type) return null;

    const triggerConfig: Record<
      string,
      { icon: React.ElementType; label: string }
    > = {
      event: { icon: Zap, label: "Event" },
      segment: { icon: UserCircle, label: "Segment" },
    };
    const { icon: Icon, label } = triggerConfig[trigger.type] || {};

    return (
      <Badge variant="outline" className="bg-meadow-500 text-forest-500">
        {Icon && <Icon size={12} className="mr-1" />}
        <span>
          {label}: {trigger.name}
        </span>
      </Badge>
    );
  };

  const JourneyList = () => (
    <Card className="bg-forest-600 border-meadow-500/20">
      <Table>
        <TableHeader>
          <TableRow className="border-meadow-500/20 hover:bg-forest-400">
            <TableHead className="text-meadow-500">Name</TableHead>
            <TableHead className="text-meadow-500">Status</TableHead>
            <TableHead className="text-meadow-500">Trigger</TableHead>
            <TableHead className="text-meadow-500">Steps</TableHead>
            {/* <TableHead className="text-meadow-500">Audience</TableHead> */}
            <TableHead className="text-meadow-500">Run Count</TableHead>
            <TableHead className="text-meadow-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJourneys.map((journey) => (
            <TableRow
              key={journey.id}
              className="border-meadow-500/20 hover:bg-forest-400"
            >
              <TableCell className="font-medium text-white">
                {journey.name}
              </TableCell>
              <TableCell>
                <StatusBadge status={journey.status} />
              </TableCell>
              <TableCell>
                <TriggerBadge trigger={extractTriggerInfo(journey)} />
              </TableCell>
              <TableCell className="text-white">
                {journey.definition.nodes.length}
              </TableCell>
              <TableCell className="text-white">
                {journey.metrics?.totalUsers.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="w-full bg-forest-400 rounded-full h-2.5">
                  <div
                    className="bg-meadow-500 h-2.5 rounded-full"
                    style={{
                      width: `${journey.metrics?.completionRate || 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-meadow-500 mt-1">
                  {journey.metrics?.completionRate || 0}%
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedJourney(journey);
                      fetchJourneyMetrics(journey.id);
                      fetchRecentActivities(journey.id);
                    }}
                    className="text-meadow-500 hover:text-white hover:bg-forest-400"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/journeys/builder/${journey.id}`)
                    }
                    className="text-meadow-500 hover:text-white hover:bg-forest-400"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setJourneyToDelete(journey);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-meadow-500 hover:text-white hover:bg-forest-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setJourneyToChangeStatus(journey);
                      setStatusChangeDialogOpen(true);
                    }}
                    className="text-meadow-500 hover:text-white hover:bg-forest-400"
                  >
                    {journey.status === "ACTIVE" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  const JourneyDetails = ({ journey }) => (
    <Sheet
      open={!!selectedJourney}
      onOpenChange={() => setSelectedJourney(null)}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] bg-forest-500 border-l border-meadow-500/20"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-meadow-500">
            {journey.name}
          </SheetTitle>
          <SheetDescription className="text-white">
            Journey details and analytics
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          <div className="space-y-6 pb-8">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-forest-600 border-meadow-500/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-meadow-500">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadge status={journey.status} />
                </CardContent>
              </Card>
              <Card className="bg-forest-600 border-meadow-500/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-meadow-500">
                    Trigger
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TriggerBadge trigger={extractTriggerInfo(journey)} />
                </CardContent>
              </Card>
              <Card className="bg-forest-600 border-meadow-500/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-meadow-500">
                    Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-white">
                    {journey.definition.nodes.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-meadow-500">Audience Size</p>
                    <p className="text-2xl font-bold text-white">
                      {journeyMetrics?.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-meadow-500">Completion Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {journeyMetrics?.completionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-meadow-500">
                      Avg. Time to Complete
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {journeyMetrics?.averageCompletionTime.toFixed(1)} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Journey Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journey.definition.nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-meadow-500 flex items-center justify-center text-forest-500 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-white">
                          {node.data.name || `Step ${index + 1}`}
                        </p>
                        <p className="text-sm text-meadow-500">{node.type}</p>
                      </div>
                      <div className="text-sm text-meadow-500">
                        Conversion:{" "}
                        {(
                          (journeyMetrics?.stepMetrics[node.id]?.completed /
                            journeyMetrics?.stepMetrics[node.id]?.total) *
                            100 || 0
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-meadow-500"></div>
                      <div>
                        <p className="font-medium text-white">
                          {activity.type}: {activity.nodeName}
                        </p>
                        <p className="text-sm text-meadow-500">
                          User ID: {activity.userId}
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-meadow-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  const AnalyticsPanel = () => (
    <Sheet open={isAnalyticsPanelOpen} onOpenChange={setIsAnalyticsPanelOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[900px] bg-forest-500 border-l border-meadow-500/20"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-meadow-500">
            Journey Analytics Dashboard
          </SheetTitle>
          <SheetDescription className="text-white">
            Comprehensive overview of all your journey performances
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          <div className="space-y-8 pb-8">
            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-forest-400 p-4 rounded-lg">
                    <p className="text-sm text-meadow-500">
                      Total Active Journeys
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {journeys.filter((j) => j.status === "ACTIVE").length}
                    </p>
                  </div>
                  <div className="bg-forest-400 p-4 rounded-lg">
                    <p className="text-sm text-meadow-500">
                      Avg. Completion Rate
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {(
                        journeys.reduce(
                          (sum, j) => sum + (j.metrics?.completionRate || 0),
                          0
                        ) / journeys.length
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="bg-forest-400 p-4 rounded-lg">
                    <p className="text-sm text-meadow-500">
                      Total Users in Journeys
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {journeys
                        .reduce(
                          (sum, j) => sum + (j.metrics?.totalUsers || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-forest-400 p-4 rounded-lg">
                    <p className="text-sm text-meadow-500">
                      Journeys Created (Last 30 days)
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {
                        journeys.filter(
                          (j) =>
                            new Date(j.createdAt) >
                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Top Performing Journeys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journeys
                    .sort(
                      (a, b) =>
                        (b.metrics?.completionRate || 0) -
                        (a.metrics?.completionRate || 0)
                    )
                    .slice(0, 3)
                    .map((journey) => (
                      <div
                        key={journey.id}
                        className="flex items-center justify-between bg-forest-400 p-4 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {journey.name}
                          </p>
                          <TriggerBadge trigger={extractTriggerInfo(journey)} />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">
                            {journey.metrics?.completionRate || 0}%
                          </p>
                          <p className="text-sm text-meadow-500">
                            Completion Rate
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-forest-600 border-meadow-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-meadow-500">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 bg-forest-400 p-3 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-meadow-500"></div>
                      <div className="flex-grow">
                        <p className="text-white">
                          {activity.type}:{" "}
                          <span className="font-medium">
                            {activity.nodeName}
                          </span>
                        </p>
                      </div>
                      <div className="text-sm text-meadow-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="bg-forest-500 min-h-screen">
      <header className="bg-forest-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-meadow-500">
              Journey Management
            </h1>
            <div className="flex space-x-4">
              <Button
                onClick={() => setIsAnalyticsPanelOpen(true)}
                className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
              >
                <BarChart2 className="mr-2 h-4 w-4" /> Analytics
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-meadow-500 text-forest-500 hover:bg-meadow-600">
                    <Plus className="mr-2 h-4 w-4" /> Create Journey
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-forest-600 text-white border-meadow-500">
                  <DialogHeader>
                    <DialogTitle className="text-meadow-500">
                      Create New Journey
                    </DialogTitle>
                    <DialogDescription className="text-white">
                      Set up a new customer journey to engage your audience.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-meadow-500">
                        Journey Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter journey name"
                        value={newJourneyName}
                        onChange={(e) => setNewJourneyName(e.target.value)}
                        className="bg-forest-500 text-white border-meadow-500 focus:ring-meadow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-meadow-500">
                        Journey Repeat Option
                      </Label>
                      <div className="flex items-center space-x-3 bg-forest-400 p-3 rounded-md">
                        <Switch
                          id="repeat-option"
                          checked={newJourneyRepeatOption === "multiple"}
                          onCheckedChange={(checked) =>
                            setNewJourneyRepeatOption(
                              checked ? "multiple" : "once"
                            )
                          }
                          className="data-[state=checked]:bg-meadow-500 data-[state=unchecked]:bg-forest-200"
                        />
                        <Label
                          htmlFor="repeat-option"
                          className="text-white cursor-pointer select-none flex-grow"
                        >
                          {newJourneyRepeatOption === "once"
                            ? "Run once per customer"
                            : "Can run multiple times per customer"}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={createJourney}
                      className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
                    >
                      Create Journey
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-forest-600">
              <TabsTrigger
                value="all"
                className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-forest-500"
              >
                All Journeys
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-forest-500"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="paused"
                className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-forest-500"
              >
                Paused
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-forest-500"
              >
                Drafts
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-meadow-500" />
              <Input
                type="text"
                placeholder="Search journeys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-forest-600 text-white border-meadow-500 focus:ring-meadow-500"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] bg-forest-600 text-white border-meadow-500">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="bg-forest-600 text-white border-meadow-500">
                <SelectItem value="all">All Triggers</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="segment">Segments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <JourneyList />
        {selectedJourney && <JourneyDetails journey={selectedJourney} />}
        <AnalyticsPanel />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-forest-600 text-white border-meadow-500">
            <DialogHeader>
              <DialogTitle className="text-meadow-500">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to delete the journey "
                {journeyToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-forest-500 text-white hover:bg-forest-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Confirmation Dialog */}
        <Dialog
          open={statusChangeDialogOpen}
          onOpenChange={setStatusChangeDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px] bg-forest-600 text-white border-meadow-500">
            <DialogHeader>
              <DialogTitle className="text-meadow-500">
                Confirm Status Change
              </DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to{" "}
                {journeyToChangeStatus?.status === "ACTIVE"
                  ? "pause"
                  : "activate"}{" "}
                the journey "{journeyToChangeStatus?.name}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setStatusChangeDialogOpen(false)}
                className="bg-forest-500 text-white hover:bg-forest-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusChangeConfirm}
                className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {filteredJourneys.length === 0 && (
          <Card className="p-6 text-center mt-6 bg-forest-600 border-meadow-500">
            <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-meadow-500">
              No journeys found
            </h2>
            <p className="text-white">
              {searchQuery
                ? "No journeys match your search. Try adjusting your search terms."
                : "You haven't created any journeys yet. Click 'Create Journey' to get started."}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default JourneyManagement;
