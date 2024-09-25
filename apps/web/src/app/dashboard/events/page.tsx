"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Settings,
  X,
  ChevronDown,
  ClipboardX,
  Tag,
  Activity,
  AlertCircle,
  User,
  Clock,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  SortAsc,
  SortDesc,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EventData, eventsService } from "@/services/eventsService";
import Loading from "@/components/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// interface DatePickerWithRangeProps {
//   className?: string;
//   onDateRangeChange: (range: DateRange | undefined) => void;
// }

// function DatePickerWithRange({
//   className,
//   onDateRangeChange,
// }: DatePickerWithRangeProps) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   });

//   const handleDateChange = (newDate: DateRange | undefined) => {
//     setDate(newDate);
//     onDateRangeChange(newDate);
//   };

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant="outline"
//             size="sm"
//             className={cn(
//               "w-[240px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LLL dd, y")} -{" "}
//                   {format(date.to, "LLL dd, y")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0 bg-forest-600" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={handleDateChange}
//             numberOfMonths={2}
//             className="bg-forest-600 text-white"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

export default function EventsManagement() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<Partial<EventData>>({
    properties: {},
  });
  const [visibleProperties, setVisibleProperties] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<string[]>([]);
  const [customProperties, setCustomProperties] = useState<
    { key: string; value: string }[]
  >([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<keyof EventData>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await eventsService.getEvents();
      setEvents(fetchedEvents);
      const propertySet = new Set<string>();
      fetchedEvents.forEach((event) => {
        Object.keys(event.properties).forEach((prop) => propertySet.add(prop));
      });
      const allPropsArray = Array.from(propertySet);
      setAllProperties(allPropsArray);

      setVisibleProperties([
        "name",
        "entity_external_id",
        "timestamp",
        ...allPropsArray.slice(0, 3),
      ]);
    } catch (error) {
      console.error("Error fetching events:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyToggle = (property: string) => {
    setSelectedProperties((prev) =>
      prev.includes(property)
        ? prev.filter((p) => p !== property)
        : [...prev, property]
    );
  };

  const handleError = (error: any) => {
    if (error.response && error.response.status === 401) {
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    }
  };

  const filteredAndSortedEvents = events
    .filter((event) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchLower) ||
        event.entity_external_id.toLowerCase().includes(searchLower) ||
        Object.values(event.properties).some((value) =>
          value.toString().toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const handleCreateEvent = async () => {
    const allProperties = {
      ...newEventData.properties,
      ...Object.fromEntries(
        customProperties.map((prop) => [prop.key, prop.value])
      ),
    };

    try {
      const createdEvent = await eventsService.recordEvent({
        entity_external_id: newEventData.entity_external_id!,
        name: newEventData.name!,
        properties: allProperties,
      });

      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      const newProps = Object.keys(allProperties);
      setAllProperties((prevProps) => [
        ...prevProps,
        ...newProps.filter((prop) => !prevProps.includes(prop)),
      ]);

      setIsCreateEventOpen(false);
      setNewEventData({ properties: {} });
      setCustomProperties([]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const addCustomProperty = () => {
    setCustomProperties([...customProperties, { key: "", value: "" }]);
  };

  const updateCustomProperty = (index: number, key: string, value: string) => {
    const updatedProperties = [...customProperties];
    updatedProperties[index] = { key, value };
    setCustomProperties(updatedProperties);
  };

  const removeCustomProperty = (index: number) => {
    const updatedProperties = customProperties.filter((_, i) => i !== index);
    setCustomProperties(updatedProperties);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Implement date range filtering logic here
  };

  const EventGrid: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {filteredAndSortedEvents.map((event) => (
        <motion.div
          key={event.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-forest-600 border-meadow-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {event.name}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-forest-500 text-meadow-500 border-meadow-500"
                >
                  {event.entity_external_id}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4">
                {new Date(event.timestamp).toLocaleString()}
              </p>
              <div className="space-y-2">
                {Object.entries(event.properties)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-meadow-500">{key}:</span>
                      <span className="text-white">{value.toString()}</span>
                    </div>
                  ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                  className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-500"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-forest-600 rounded-lg border border-meadow-500 p-8">
      <ClipboardX className="w-16 h-16 text-meadow-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">No events found</h2>
      <p className="text-gray-300 text-center mb-6">
        It looks like there are no events recorded yet. Start by creating your
        first event!
      </p>
      <Button
        onClick={() => setIsCreateEventOpen(true)}
        className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
      >
        <Plus className="mr-2 h-4 w-4" /> Record Your First Event
      </Button>
    </div>
  );

  return (
    <div className="px-8 py-6 bg-forest-500 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsCreateEventOpen(true)}
              className="bg-meadow-500 text-forest-500 hover:bg-meadow-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Record Event
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-forest-600 text-white border-meadow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent"
            />
          </div>
          {/* <DatePickerWithRange onDateRangeChange={handleDateRangeChange} /> */}
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as keyof EventData)}
          >
            <SelectTrigger className="w-[180px] bg-forest-600 text-white border-meadow-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-forest-600 text-white">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="entity_external_id">Entity ID</SelectItem>
              <SelectItem value="timestamp">Timestamp</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
          >
            {viewMode === "list" ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="bg-forest-600 border-meadow-500">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-forest-700 border-meadow-500">
                        {visibleProperties.map((prop) => (
                          <TableHead key={prop} className="text-meadow-500">
                            {prop.charAt(0).toUpperCase() + prop.slice(1)}
                          </TableHead>
                        ))}
                        <TableHead className="text-meadow-500">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedEvents.map((event) => (
                        <TableRow
                          key={event.id}
                          className="hover:bg-forest-700 border-meadow-500"
                        >
                          {visibleProperties.map((prop) => (
                            <TableCell key={prop} className="text-white">
                              {prop === "timestamp"
                                ? new Date(event[prop]).toLocaleString()
                                : prop === "properties"
                                  ? JSON.stringify(event[prop])
                                  : event[prop] || "-"}
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="text-meadow-500 hover:text-meadow-400 hover:bg-forest-600"
                              onClick={() => setSelectedEvent(event)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            ) : (
              <EventGrid />
            )}
          </AnimatePresence>
        )}

        <Sheet open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <SheetContent className="bg-forest-600 text-white border-l border-meadow-500 w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-meadow-500">
                Record New Event
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="entity_id" className="text-white">
                  Entity ID
                </Label>
                <Input
                  id="entity_id"
                  value={newEventData.entity_external_id || ""}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      entity_external_id: e.target.value,
                    })
                  }
                  className="bg-forest-700 border-meadow-500 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-white">
                  Event Name
                </Label>
                <Input
                  id="name"
                  value={newEventData.name || ""}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      name: e.target.value,
                    })
                  }
                  className="bg-forest-700 border-meadow-500 text-white mt-1"
                />
              </div>
              {customProperties.map((prop, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Property Name"
                    value={prop.key}
                    onChange={(e) =>
                      updateCustomProperty(index, e.target.value, prop.value)
                    }
                    className="bg-forest-700 border-meadow-500 text-white"
                  />
                  <Input
                    placeholder="Value"
                    value={prop.value}
                    onChange={(e) =>
                      updateCustomProperty(index, prop.key, e.target.value)
                    }
                    className="bg-forest-700 border-meadow-500 text-white"
                  />
                  <Button
                    onClick={() => removeCustomProperty(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={addCustomProperty}
                variant="outline"
                className="mt-2 bg-forest-700 text-white hover:bg-forest-600 hover:text-white border border-meadow-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Custom Property
              </Button>
              <SheetFooter>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-meadow-500 text-forest-500 hover:bg-meadow-600 mt-4"
                >
                  Record Event
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>

        {selectedEvent && (
          <Sheet
            open={!!selectedEvent}
            onOpenChange={() => setSelectedEvent(null)}
          >
            <SheetContent className="bg-forest-600 text-white border-l border-meadow-500 w-[600px] sm:max-w-[600px] overflow-y-auto">
              <SheetHeader className="flex justify-between items-center mb-6">
                <SheetTitle className="text-white text-3xl font-bold">
                  Event Details
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="text-meadow-500 border-meadow-500"
                >
                  {selectedEvent.name}
                </Badge>
              </SheetHeader>
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-4 text-meadow-500 flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-forest-700 p-4 rounded-md">
                      <p className="text-gray-300 text-sm mb-1">Entity ID</p>
                      <p className="text-white font-medium">
                        {selectedEvent.entity_external_id}
                      </p>
                    </div>
                    <div className="bg-forest-700 p-4 rounded-md">
                      <p className="text-gray-300 text-sm mb-1">Timestamp</p>
                      <p className="text-white font-medium">
                        {new Date(selectedEvent.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4 text-meadow-500 flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    Properties
                  </h3>
                  {Object.keys(selectedEvent.properties).length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedEvent.properties).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-forest-700 p-4 rounded-md"
                          >
                            <p className="text-gray-300 text-sm mb-1">{key}</p>
                            <p className="text-white font-medium">
                              {value.toString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <Card className="bg-forest-700 border-meadow-500">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-2" />
                        <p className="text-gray-300 text-center">
                          No properties found for this event.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
