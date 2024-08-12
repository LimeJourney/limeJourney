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
} from "lucide-react";

interface EntityData {
  id: string;
  org_id: string;
  external_id?: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  entityId: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

// Mock data
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
  },
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
  return (
    <div className="px-8 py-6">
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
                className="border-brightYellow text-black hover:text-white hover:bg-neutral-800"
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
              <Button className="bg-neutral-800 text-white hover:bg-brightYellow hover:text-black border border-brightYellow">
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
                      className="mt-2"
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
            className="pl-8 pr-4 py-2 bg-white text-black border border-brightYellow rounded-md focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent w-full"
          />
        </div>
      </div>
      <Card className="bg-[#040b12] border-brightYellow">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-neutral-800 border-brightYellow">
              {visibleProperties.map((prop) => (
                <TableHead key={prop} className="text-white font-medium">
                  {prop.charAt(0).toUpperCase() + prop.slice(1)}
                </TableHead>
              ))}
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.map((entity) => (
              <TableRow
                key={entity.id}
                className="hover:bg-neutral-900 hover:text-black border-white"
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
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-brightYellow hover:text-brightYellow/80 hover:bg-black"
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
          <SheetContent className="bg-[#040b12] text-black border-l border-neutral-700 w-[400px] sm:max-w-[400px]">
            <SheetHeader className="flex justify-between items-center">
              <SheetTitle className="text-white text-2xl">
                Entity Details
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-brightYellow">
                    Properties
                  </h3>
                  {Object.keys(selectedEntity.properties).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(selectedEntity.properties).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-neutral-800 p-3 rounded-md"
                          >
                            <p className="text-neutral-400 text-sm">{key}</p>
                            <p className="text-white font-medium truncate">
                              {value.toString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <Card className="bg-neutral-800 border-neutral-700">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <ClipboardX className="h-12 w-12 text-neutral-500 mb-2" />
                        <p className="text-neutral-400 text-center">
                          No properties found for this entity.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-brightYellow">
                    Recent Events
                  </h3>
                  {mockEvents.filter(
                    (event) => event.entityId === selectedEntity.id
                  ).length > 0 ? (
                    <div className="space-y-3">
                      {mockEvents
                        .filter((event) => event.entityId === selectedEntity.id)
                        .map((event) => (
                          <details key={event.id} className="group">
                            <summary className="flex justify-between items-center cursor-pointer list-none bg-neutral-800 p-3 rounded-md">
                              <div className="flex flex-col">
                                <Badge
                                  variant="outline"
                                  className="w-fit bg-brightYellow text-black mb-1"
                                >
                                  {event.name}
                                </Badge>
                                <span className="text-neutral-400 text-xs">
                                  {new Date(event.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <ChevronDown className="h-4 w-4 text-neutral-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="bg-neutral-700 p-3 mt-2 rounded-md text-sm">
                              {Object.entries(event.properties).length > 0 ? (
                                <div className="space-y-2">
                                  {Object.entries(event.properties).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex justify-between"
                                      >
                                        <span className="text-neutral-400">
                                          {key}:
                                        </span>
                                        <span className="text-white">
                                          {value.toString()}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-neutral-400">
                                  No additional properties
                                </p>
                              )}
                            </div>
                          </details>
                        ))}
                    </div>
                  ) : (
                    <Card className="bg-neutral-800 border-neutral-700">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <ClipboardX className="h-12 w-12 text-neutral-500 mb-2" />
                        <p className="text-neutral-400 text-center">
                          No recent events found for this entity.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
