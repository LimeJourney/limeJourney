"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Layers,
  Activity,
  Calendar,
  AlertCircle,
  User,
  Clock,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Segment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface EntityData {
  id: string;
  org_id: string;
  external_id?: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
  segments: Segment[];
}

interface Event {
  id: string;
  entityId: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

const generateRandomSegments = (count: number): Segment[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `seg${index + 1}`,
    name: `Segment ${index + 1}`,
    description: `Description for Segment ${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

const mockEntities: EntityData[] = [
  {
    id: "1",
    org_id: "org1",
    external_id: "user1",
    properties: {
      name: "John Doe",
      email: "john@example.com",
      plan: "premium",
      lastPurchase: "2023-07-15",
    },
    created_at: "2023-01-01",
    updated_at: "2023-08-01",
    segments: generateRandomSegments(2), // Few segments
  },
  {
    id: "2",
    org_id: "org1",
    external_id: "user2",
    properties: {
      name: "Jane Smith",
      email: "jane@example.com",
      plan: "basic",
    },
    created_at: "2023-02-15",
    updated_at: "2023-07-20",
    segments: generateRandomSegments(15), // Many segments
  },
  {
    id: "3",
    org_id: "org1",
    external_id: "user3",
    properties: {
      name: "Bob Johnson",
      email: "bob@example.com",
      plan: "premium",
      company: "Acme Inc.",
    },
    created_at: "2023-03-10",
    updated_at: "2023-08-05",
    segments: generateRandomSegments(50), // A lot of segments
  },
  // Add more mock entities as needed
];

const mockEvents: Event[] = [
  {
    id: "1",
    entityId: "1",
    name: "login",
    properties: {},
    timestamp: "2023-08-01T10:00:00Z",
  },
  {
    id: "2",
    entityId: "1",
    name: "purchase",
    properties: { product: "Widget X", amount: 99.99 },
    timestamp: "2023-08-02T14:30:00Z",
  },
  {
    id: "3",
    entityId: "2",
    name: "login",
    properties: {},
    timestamp: "2023-07-20T09:15:00Z",
  },
];

export default function EntityManagement() {
  const [entities, setEntities] = useState<EntityData[]>(mockEntities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<EntityData | null>(null);
  const [isCreateEntityOpen, setIsCreateEntityOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<EntityData>>({
    properties: {},
  });
  const [visibleProperties, setVisibleProperties] = useState<string[]>([
    "name",
    "email",
    "plan",
  ]);
  const [allProperties, setAllProperties] = useState<string[]>([]);
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);
  const [customProperties, setCustomProperties] = useState<
    { key: string; value: string }[]
  >([]);
  useEffect(() => {
    const propertySet = new Set<string>();
    entities.forEach((entity) => {
      Object.keys(entity.properties).forEach((prop) => propertySet.add(prop));
    });
    setAllProperties(Array.from(propertySet));
  }, [entities]);

  const filteredEntities = entities.filter((entity) =>
    Object.values(entity.properties).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCreateEntity = () => {
    const allProperties = {
      ...newEntityData.properties,
      ...Object.fromEntries(
        customProperties.map((prop) => [prop.key, prop.value])
      ),
    };

    const newEntity: EntityData = {
      id: (entities.length + 1).toString(),
      org_id: "org1",
      external_id: newEntityData.external_id,
      properties: allProperties,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      segments: [],
    };
    setEntities([...entities, newEntity]);
    setIsCreateEntityOpen(false);
    setNewEntityData({ properties: {} });
    setCustomProperties([]);
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
  const handlePropertyChange = (property: string) => {
    setVisibleProperties((prev) =>
      prev.includes(property)
        ? prev.filter((p) => p !== property)
        : [...prev, property]
    );
  };

  const renderSegments = (segments: Segment[]) => {
    const maxDisplayed = 2;
    const displayedSegments = segments.slice(0, maxDisplayed);
    const remainingCount = segments.length - maxDisplayed;

    return (
      <div className="flex flex-wrap gap-1">
        {displayedSegments.map((segment) => (
          <HoverCard key={segment.id}>
            <HoverCardTrigger asChild>
              <div className="cursor-pointer">
                <Badge
                  variant="outline"
                  className="bg-neutral-800 text-brightYellow border-brightYellow"
                >
                  {segment.name}
                </Badge>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-neutral-800 border-neutral-700">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-brightYellow">
                  {segment.name}
                </h4>
                <p className="text-sm text-neutral-300">
                  {segment.description}
                </p>
                <div className="flex items-center pt-2">
                  <Tag className="mr-2 h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400">
                    Created on{" "}
                    {new Date(segment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        {remainingCount > 0 && (
          <Badge
            variant="outline"
            className="bg-neutral-800 text-brightYellow border-brightYellow"
          >
            +{remainingCount} more
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="px-8 py-6 bg-black text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Entities</h1>
        <div className="flex items-center space-x-4">
          <Dialog
            open={isCustomizeViewOpen}
            onOpenChange={setIsCustomizeViewOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-brightYellow bg-neutral-800 text-white hover:text-black hover:bg-brightYellow"
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize View
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-700">
              <DialogHeader>
                <DialogTitle className="text-white">Customize View</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[300px] mt-4">
                {allProperties.map((property) => (
                  <div
                    key={property}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Checkbox
                      id={property}
                      checked={visibleProperties.includes(property)}
                      onCheckedChange={() => handlePropertyChange(property)}
                    />
                    <Label htmlFor={property} className="text-white">
                      {property}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Sheet open={isCreateEntityOpen} onOpenChange={setIsCreateEntityOpen}>
            <SheetTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-brightYellow hover:text-black border border-brightYellow">
                <Plus className="mr-2 h-4 w-4" /> Add Entity
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700">
              <SheetHeader>
                <SheetTitle className="text-white">Add New Entity</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="manual" className="mt-6">
                <TabsList className="bg-neutral-800">
                  <TabsTrigger
                    value="manual"
                    className="data-[state=active]:bg-brightYellow"
                  >
                    Manual
                  </TabsTrigger>
                  <TabsTrigger
                    value="sdk"
                    className="data-[state=active]:bg-brightYellow"
                  >
                    SDK
                  </TabsTrigger>
                  <TabsTrigger
                    value="integration"
                    className="data-[state=active]:bg-brightYellow"
                  >
                    Integration
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="external_id">External ID</Label>
                      <Input
                        id="external_id"
                        value={newEntityData.external_id || ""}
                        onChange={(e) =>
                          setNewEntityData({
                            ...newEntityData,
                            external_id: e.target.value,
                          })
                        }
                        className="bg-neutral-800 border-neutral-700 text-white mt-1"
                      />
                    </div>
                    {allProperties.map((prop) => (
                      <div key={prop}>
                        <Label htmlFor={prop}>{prop}</Label>
                        <Input
                          id={prop}
                          value={newEntityData.properties?.[prop] || ""}
                          onChange={(e) =>
                            setNewEntityData({
                              ...newEntityData,
                              properties: {
                                ...newEntityData.properties,
                                [prop]: e.target.value,
                              },
                            })
                          }
                          className="bg-neutral-800 border-neutral-700 text-white mt-1"
                        />
                      </div>
                    ))}
                    {customProperties.map((prop, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Property Name"
                          value={prop.key}
                          onChange={(e) =>
                            updateCustomProperty(
                              index,
                              e.target.value,
                              prop.value
                            )
                          }
                          className="bg-neutral-800 border-neutral-700 text-white"
                        />
                        <Input
                          placeholder="Value"
                          value={prop.value}
                          onChange={(e) =>
                            updateCustomProperty(
                              index,
                              prop.key,
                              e.target.value
                            )
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
                      className="mt-2 bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white border border-brightYellow"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Custom Property
                    </Button>
                    <Button
                      onClick={handleCreateEntity}
                      className="bg-neutral-800 text-white hover:bg-neutral-700 border border-brightYellow mt-4"
                    >
                      Create Entity
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="sdk">
                  <div className="py-4">
                    <p className="text-sm text-neutral-400 mb-4">
                      Use our SDK to programmatically add entities to your
                      organization.
                    </p>
                    <Card className="bg-neutral-800 border-neutral-700">
                      <CardContent className="p-4">
                        <pre className="text-sm text-neutral-300">
                          <code>
                            {`
import { OurSDK } from 'our-sdk';

const sdk = new OurSDK('YOUR_API_KEY');

sdk.addEntity({
  external_id: 'user123',
  properties: {
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'premium'
  }
});
                            `}
                          </code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="integration">
                  <div className="py-4">
                    <p className="text-sm text-neutral-400 mb-4">
                      Connect with your favorite Customer Data Platform (CDP) to
                      sync entities automatically.
                    </p>
                    <Button className="bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-600">
                      <Database className="mr-2 h-4 w-4" />
                      Connect to Segment
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-2 bg-neutral-800 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent w-full"
          />
        </div>
      </div>
      <Card className="bg-neutral-900  border-neutral-700">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-neutral-800 border-neutral-700">
              {visibleProperties.map((prop) => (
                <TableHead key={prop} className="text-white font-medium">
                  {prop.charAt(0).toUpperCase() + prop.slice(1)}
                </TableHead>
              ))}
              <TableHead className="text-white font-medium">Segments</TableHead>
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.map((entity) => (
              <TableRow
                key={entity.id}
                className="hover:bg-neutral-800 border-neutral-700"
              >
                {visibleProperties.map((prop) => (
                  <TableCell key={prop} className="text-white">
                    {prop === "plan" ? (
                      <Badge
                        variant={
                          entity.properties[prop] === "premium"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          entity.properties[prop] === "premium"
                            ? "bg-brightYellow text-black"
                            : "bg-neutral-700"
                        }
                      >
                        {entity.properties[prop]}
                      </Badge>
                    ) : (
                      entity.properties[prop] || "-"
                    )}
                  </TableCell>
                ))}
                <TableCell>{renderSegments(entity.segments)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-brightYellow hover:text-brightYellow/80 hover:bg-neutral-800"
                    onClick={() => setSelectedEntity(entity)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedEntity && (
        <Sheet
          open={!!selectedEntity}
          onOpenChange={() => setSelectedEntity(null)}
        >
          <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700 w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader className="flex justify-between items-center mb-6">
              <SheetTitle className="text-white text-3xl font-bold">
                Entity Details
              </SheetTitle>
              <Badge
                variant="outline"
                className="text-brightYellow border-brightYellow"
              >
                {selectedEntity.external_id || "No External ID"}
              </Badge>
            </SheetHeader>
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold mb-4 text-brightYellow flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Basic Information
                </h3>
                {Object.keys(selectedEntity.properties).length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedEntity.properties).map(
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
                        No properties found for this entity.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 text-brightYellow flex items-center">
                  <Layers className="mr-2 h-5 w-5" />
                  Segments
                </h3>
                {selectedEntity.segments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEntity.segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="bg-neutral-800 p-4 rounded-md"
                      >
                        <h4 className="text-brightYellow font-medium mb-2">
                          {segment.name}
                        </h4>
                        <p className="text-sm text-neutral-300 mb-3">
                          {segment.description}
                        </p>
                        <div className="flex items-center text-xs text-neutral-400">
                          <Calendar className="mr-1 h-3 w-3" />
                          Created on{" "}
                          {new Date(segment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <Layers className="h-12 w-12 text-neutral-500 mb-2" />
                      <p className="text-neutral-400 text-center">
                        This entity is not part of any segments yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 text-brightYellow flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Recent Events
                </h3>
                {mockEvents.filter(
                  (event) => event.entityId === selectedEntity.id
                ).length > 0 ? (
                  <div className="space-y-4">
                    {mockEvents
                      .filter((event) => event.entityId === selectedEntity.id)
                      .map((event) => (
                        <Card
                          key={event.id}
                          className="bg-neutral-800 border-neutral-700"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-brightYellow text-black mb-2"
                                >
                                  {event.name}
                                </Badge>
                                <p className="text-sm text-neutral-300">
                                  {Object.entries(event.properties)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")}
                                </p>
                              </div>
                              <div className="flex items-center text-xs text-neutral-400">
                                <Clock className="mr-1 h-3 w-3" />
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <Activity className="h-12 w-12 text-neutral-500 mb-2" />
                      <p className="text-neutral-400 text-center">
                        No recent events found for this entity.
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
