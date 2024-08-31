"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Settings,
  Code,
  Database,
  X,
  ChevronDown,
  ClipboardX,
  Tag,
  Activity,
  AlertCircle,
  User,
  Clock,
  Loader2,
  Eye,
  EyeOff,
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
interface DatePickerWithRangeProps {
  className?: string;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

function DatePickerWithRange({
  className,
  onDateRangeChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onDateRangeChange(newDate);
  };

  return (
    <div className={cn("grid gap-2 bg-neutral-700", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[200px] justify-start text-left font-normal h-9 text-black",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-black" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MM/dd/yy")} -{" "}
                  {format(date.to, "MM/dd/yy")}
                </>
              ) : (
                format(date.from, "MM/dd/yy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);
  const [customProperties, setCustomProperties] = useState<
    { key: string; value: string }[]
  >([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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

      // Set the first 3 properties as visible by default
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

  const applyCustomView = () => {
    setVisibleProperties(selectedProperties);
    setIsCustomizeViewOpen(false);
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

  const filteredEvents = events.filter((event) => {
    if (!event.properties) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.entity_external_id.toLowerCase().includes(searchLower) ||
      Object.values(event.properties).some((value) =>
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // You can add logic here to filter events based on the selected date range
  };

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

      // Update the events state immediately
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      // Update allProperties and visibleProperties
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

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    // You can add logic here to filter events based on the selected date
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-neutral-900 rounded-lg border border-neutral-800 p-8">
      <ClipboardX className="w-16 h-16 text-neutral-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">No events found</h2>
      <p className="text-neutral-400 text-center mb-6">
        It looks like there are no events recorded yet. Start by creating your
        first event!
      </p>
      <Button
        onClick={() => setIsCreateEventOpen(true)}
        className="bg-screaminGreen text-black hover:bg-screaminGreen/90"
      >
        <Plus className="mr-2 h-4 w-4" /> Record Your First Event
      </Button>
    </div>
  );

  return (
    <div className="px-8 py-6 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <div className="flex items-center space-x-4">
          <Dialog
            open={isCustomizeViewOpen}
            onOpenChange={setIsCustomizeViewOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-screaminGreen bg-neutral-800 text-white hover:text-black hover:bg-screaminGreen"
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize View
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-700 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center">
                  <Settings className="mr-2 h-6 w-6" />
                  Customize Event View
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-neutral-400 mb-6">
                  Select the properties you want to display in the events table.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-screaminGreen flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Visible Properties
                    </h3>
                    <ScrollArea className="h-[300px] rounded-md border border-neutral-700 bg-neutral-800 p-4">
                      {selectedProperties.map((property) => (
                        <div
                          key={property}
                          className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-b-0"
                        >
                          <span className="text-white">{property}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePropertyToggle(property)}
                                >
                                  <EyeOff className="h-4 w-4 text-neutral-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hide this property</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-screaminGreen flex items-center">
                      <EyeOff className="mr-2 h-5 w-5" />
                      Hidden Properties
                    </h3>
                    <ScrollArea className="h-[300px] rounded-md border border-neutral-700 bg-neutral-800 p-4">
                      {allProperties
                        .filter((prop) => !selectedProperties.includes(prop))
                        .map((property) => (
                          <div
                            key={property}
                            className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-b-0"
                          >
                            <span className="text-neutral-400">{property}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handlePropertyToggle(property)
                                    }
                                  >
                                    <Eye className="h-4 w-4 text-neutral-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Show this property</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                    </ScrollArea>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setIsCustomizeViewOpen(false)}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={applyCustomView}
                      className="bg-screaminGreen text-black hover:bg-screaminGreen/90"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Sheet open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <SheetTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-screaminGreen hover:text-black border border-screaminGreen">
                <Plus className="mr-2 h-4 w-4" /> Record Event
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700">
              <SheetHeader>
                <SheetTitle className="text-white">Record New Event</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="entity_id">Entity ID</Label>
                  <Input
                    id="entity_id"
                    value={newEventData.entity_external_id || ""}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setNewEventData({
                        ...newEventData,
                        entity_external_id: e.target.value,
                      });
                    }}
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={newEventData.name || ""}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        name: e.target.value,
                      })
                    }
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
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
                      className="bg-neutral-800 border-neutral-700 text-white"
                    />
                    <Input
                      placeholder="Value"
                      value={prop.value}
                      onChange={(e) =>
                        updateCustomProperty(index, prop.key, e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white"
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
                  className="mt-2 bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white border border-screaminGreen"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Custom Property
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-neutral-800 text-white hover:bg-neutral-700 border border-screaminGreen mt-4"
                >
                  Record Event
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mb-6 flex items-center space-x-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-2 py-1 h-9 bg-neutral-800 text-white border-neutral-700 rounded-md focus:ring-1 focus:ring-screaminGreen focus:border-transparent"
          />
        </div>
        <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
      </div>
      {isLoading ? (
        <Loading />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <Card className="bg-neutral-900 border-neutral-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-neutral-800 border-neutral-700">
                {visibleProperties.map((prop) => (
                  <TableHead key={prop} className="text-white font-medium">
                    {prop.charAt(0).toUpperCase() + prop.slice(1)}
                  </TableHead>
                ))}
                <TableHead className="text-white font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="hover:bg-neutral-800 border-neutral-700"
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
                      className="text-screaminGreen hover:text-screaminGreen/80 hover:bg-neutral-800"
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
      )}

      {selectedEvent && (
        <Sheet
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700 w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader className="flex justify-between items-center mb-6">
              <SheetTitle className="text-white text-3xl font-bold">
                Event Details
              </SheetTitle>
              <Badge
                variant="outline"
                className="text-screaminGreen border-screaminGreen"
              >
                {selectedEvent.name}
              </Badge>
            </SheetHeader>
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold mb-4 text-screaminGreen flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800 p-4 rounded-md">
                    <p className="text-neutral-400 text-sm mb-1">Entity ID</p>
                    <p className="text-white font-medium">
                      {selectedEvent.entity_id}
                    </p>
                  </div>
                  <div className="bg-neutral-800 p-4 rounded-md">
                    <p className="text-neutral-400 text-sm mb-1">Timestamp</p>
                    <p className="text-white font-medium">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 text-screaminGreen flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Properties
                </h3>
                {Object.keys(selectedEvent.properties).length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedEvent.properties).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-neutral-800 p-4 rounded-md"
                        >
                          <p className="text-neutral-400 text-sm mb-1">{key}</p>
                          <p className="text-white font-medium">
                            {value.toString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <AlertCircle className="h-12 w-12 text-neutral-500 mb-2" />
                      <p className="text-neutral-400 text-center">
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
  );
}
