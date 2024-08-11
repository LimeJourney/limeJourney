"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";
import LoadingPage from "../../loading";

// Types remain the same
type Role = "Admin" | "Member";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
}

// Mock data remains the same
const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    joinedAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Member",
    joinedAt: "2023-03-22",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Member",
    joinedAt: "2023-06-10",
  },
];

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<Role>("Member");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTeamMembers(mockTeamMembers);
    setIsLoading(false);
  };

  const handleInviteMember = async () => {
    setIsInviting(true);
    // Simulating API call to invite new member
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name: "New Member",
      email: newMemberEmail,
      role: newMemberRole,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setTeamMembers([...teamMembers, newMember]);
    setIsInviting(false);
    setNewMemberEmail("");
    setNewMemberRole("Member");
  };

  const handleRemoveMember = (id: number) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "Admin":
        return "text-red-400";
      case "Member":
        return "text-blue-400";
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Team Members</h1>

      <Card className="bg-neutral-800 border-neutral-700 mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-white">Your Team</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-700 hover:bg-neutral-800">
                <TableHead className="text-neutral-300">Name</TableHead>
                <TableHead className="text-neutral-300">Email</TableHead>
                <TableHead className="text-neutral-300">Role</TableHead>
                <TableHead className="text-neutral-300">Joined</TableHead>
                <TableHead className="text-right text-neutral-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-neutral-700 hover:bg-neutral-700"
                >
                  <TableCell className="text-white font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {member.email}
                  </TableCell>
                  <TableCell
                    className={`font-medium ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {member.joinedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-neutral-400 hover:text-red-400 hover:bg-neutral-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-white">
            Invite New Member
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-grow">
              <Label htmlFor="new-member-email" className="text-neutral-300">
                Email Address
              </Label>
              <Input
                id="new-member-email"
                type="email"
                placeholder="e.g., newmember@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
              />
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="new-member-role" className="text-neutral-300">
                Role
              </Label>
              <Select
                value={newMemberRole}
                onValueChange={(value: Role) => setNewMemberRole(value)}
              >
                <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleInviteMember}
              disabled={isInviting || !newMemberEmail}
              className="bg-brightYellow text-black hover:bg-brightYellow/90 w-full md:w-auto"
            >
              {isInviting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Invite Member
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-neutral-700 rounded-lg flex items-start">
        <AlertCircle className="text-brightYellow mr-3 mt-1 flex-shrink-0" />
        <p className="text-neutral-300 text-sm">
          Team members have access to your organization's resources based on
          their role. Admins can manage team members and billing, Members can
          access and modify resources, and Viewers have read-only access.
        </p>
      </div>
    </div>
  );
}
