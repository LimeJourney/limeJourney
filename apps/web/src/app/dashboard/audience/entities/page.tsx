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
  Layers,
  Activity,
  Calendar,
  AlertCircle,
  User,
  Clock,
  Loader2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  EntityData,
  EntityWithSegments,
  EventData,
  entityService,
} from "@/services/entitiesService";
import Loading from "@/components/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

export default function EntityManagement() {
  const [entities, setEntities] = useState<EntityWithSegments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] =
    useState<EntityWithSegments | null>(null);
  const [isCreateEntityOpen, setIsCreateEntityOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<EntityData>>({
    properties: {},
  });
  const [visibleProperties, setVisibleProperties] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<string[]>([]);
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);
  const [customProperties, setCustomProperties] = useState<
    { key: string; value: string }[]
  >([]);
  const [isEditEntityOpen, setIsEditEntityOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<EntityWithSegments | null>(
    null
  );
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  useEffect(() => {
    setSelectedProperties(visibleProperties);
  }, [visibleProperties]);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setIsLoading(true);
    try {
      const fetchedEntities = await entityService.listEntities();
      const entitiesArray = Array.isArray(fetchedEntities)
        ? fetchedEntities
        : [fetchedEntities];
      const entitiesWithSegments: EntityWithSegments[] = entitiesArray.map(
        (entity) => ({
          ...entity,
          segments: "segments" in entity ? entity.segments : [],
        })
      );
      setEntities(entitiesWithSegments);
      const propertySet = new Set<string>();
      entitiesWithSegments.forEach((entity) => {
        Object.keys(entity.properties).forEach((prop) => propertySet.add(prop));
      });
      const allPropsArray = Array.from(propertySet);
      setAllProperties(allPropsArray);

      // Set the first 3 properties as visible by default
      setVisibleProperties(allPropsArray.slice(0, 3));
    } catch (error) {
      console.error("Error fetching entities:", error);
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

  const filteredEntities = entities.filter((entity) => {
    if (!entity.properties) return false;
    return Object.values(entity.properties).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const handleCreateEntity = async () => {
    const allProperties = {
      ...newEntityData.properties,
      ...Object.fromEntries(
        customProperties.map((prop) => [prop.key, prop.value])
      ),
    };

    try {
      const createdEntity = await entityService.createOrUpdateEntity({
        external_id: newEntityData.external_id,
        properties: allProperties,
      });
      const entityWithSegments: EntityWithSegments = {
        ...createdEntity,
        segments: [],
      };

      // Update the entities state immediately
      setEntities((prevEntities) => [...prevEntities, entityWithSegments]);
      // Update allProperties and visibleProperties
      const newProps = Object.keys(allProperties);

      setAllProperties((prevProps) => [
        ...prevProps,
        ...newProps.filter((prop) => !prevProps.includes(prop)),
      ]);

      setVisibleProperties((prevProps) => [
        ...prevProps,
        ...newProps.filter((prop) => !prevProps.includes(prop)),
      ]);

      setIsCreateEntityOpen(false);
      setNewEntityData({ properties: {} });
      setCustomProperties([]);
      toast({
        title: "Success",
        description: "Entity created successfully",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const addCustomProperty = () => {
    setCustomProperties([...customProperties, { key: "", value: "" }]);
  };

  const handleEditEntity = (entity: EntityWithSegments) => {
    setEditingEntity(entity);
    setIsEditEntityOpen(true);
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
  const handleUpdateEntity = async () => {
    if (!editingEntity) return;

    const updatedProperties = {
      ...editingEntity.properties,
      ...Object.fromEntries(
        customProperties.map((prop) => [prop.key, prop.value])
      ),
    };

    try {
      const updatedEntity = await entityService.createOrUpdateEntity({
        external_id: editingEntity.external_id,
        properties: updatedProperties,
      });

      // Update the entities state immediately
      setEntities((prevEntities) =>
        prevEntities.map((entity) =>
          entity.external_id === updatedEntity.external_id
            ? { ...entity, properties: updatedEntity.properties }
            : entity
        )
      );

      // Update allProperties if new properties were added
      const newProps = Object.keys(updatedProperties);
      setAllProperties((prevProps) => [
        ...prevProps,
        ...newProps.filter((prop) => !prevProps.includes(prop)),
      ]);

      setVisibleProperties((prevProps) => [
        ...prevProps,
        ...newProps.filter((prop) => !prevProps.includes(prop)),
      ]);

      setIsEditEntityOpen(false);
      setEditingEntity(null);
      setCustomProperties([]);
      toast({
        title: "Success",
        description: "Entity updated successfully",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const renderSegments = (
    segments: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
    }[]
  ) => {
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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-neutral-900 rounded-lg border border-neutral-800 p-8">
      <ClipboardX className="w-16 h-16 text-neutral-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">No entities found</h2>
      <p className="text-neutral-400 text-center mb-6">
        It looks like you haven't added any entities yet. Start by creating your
        first entity!
      </p>
      <Button
        onClick={() => setIsCreateEntityOpen(true)}
        className="bg-brightYellow text-black hover:bg-brightYellow/90"
      >
        <Plus className="mr-2 h-4 w-4" /> Create Your First Entity
      </Button>
    </div>
  );

  return (
    <div className="px-8 py-6 bg-black text-white min-h-screen">
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
            <DialogContent className="bg-neutral-900 border-neutral-700 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center">
                  <Settings className="mr-2 h-6 w-6" />
                  Customize Entity View
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-neutral-400 mb-6">
                  Select the properties you want to display in the entity table.
                  You can reorder them by dragging.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-brightYellow flex items-center">
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
                    <h3 className="text-lg font-semibold mb-3 text-brightYellow flex items-center">
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
                      className="bg-brightYellow text-black hover:bg-brightYellow/90"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
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
      {isLoading ? (
        // <div className="flex justify-center items-center h-64">
        //   <Loader2 className="h-8 w-8 animate-spin text-brightYellow" />
        // </div>
        <Loading />
      ) : entities.length === 0 ? (
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
                  Segments
                </TableHead>
                <TableHead className="text-white font-medium">
                  Actions
                </TableHead>
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
                    <Button
                      variant="ghost"
                      className="text-green-500 hover:text-green-400 hover:bg-neutral-800"
                      onClick={() => handleEditEntity(entity)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

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
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Activity className="h-12 w-12 text-neutral-500 mb-2" />
                    <p className="text-neutral-400 text-center">
                      No recent events found for this entity.
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Sheet open={isEditEntityOpen} onOpenChange={setIsEditEntityOpen}>
        <SheetContent className="bg-neutral-900 text-white border-l border-neutral-700">
          <SheetHeader>
            <SheetTitle className="text-white">Edit Entity</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="external_id">External ID (read-only)</Label>
              <Input
                id="external_id"
                value={editingEntity?.external_id || ""}
                readOnly
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
              />
            </div>
            {allProperties.map((prop) => (
              <div key={prop}>
                <Label htmlFor={prop}>{prop}</Label>
                <Input
                  id={prop}
                  value={editingEntity?.properties?.[prop] || ""}
                  onChange={(e) =>
                    setEditingEntity({
                      ...editingEntity!,
                      properties: {
                        ...editingEntity!.properties,
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
              className="mt-2 bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white border border-brightYellow"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Custom Property
            </Button>
            <Button
              onClick={handleUpdateEntity}
              className="bg-neutral-800 text-white hover:bg-neutral-700 border border-brightYellow mt-4"
            >
              Update Entity
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
