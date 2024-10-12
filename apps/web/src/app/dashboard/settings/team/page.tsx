"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  UserPlus,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  OrganizationService,
  Organization,
  OrganizationMember,
  Invitation,
  UserRole,
} from "@/services/organisationService";

const OrganizationTeamManagement: React.FC = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const org = await OrganizationService.getCurrentOrganization();
      const [fetchedMembers, fetchedInvitations] = await Promise.all([
        OrganizationService.getOrganizationMembers(org.id),
        OrganizationService.getOrganizationInvitations(org.id),
      ]);
      setMembers(fetchedMembers);
      setInvitations(fetchedInvitations);

      // const
      // const orgs = await OrganizationService.;
      // if (orgs.length > 0) {
      //   const org = await OrganizationService.getOrganizationDetails(
      //     orgs[0].id
      //   );
      //   setOrganization(org);
      //   const [fetchedMembers, fetchedInvitations] = await Promise.all([
      //     OrganizationService.getOrganizationMembers(org.id),
      //     OrganizationService.getOrganizationInvitations(org.id),
      //   ]);
      //   setMembers(fetchedMembers);
      //   setInvitations(fetchedInvitations);
      // }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching organization data",
        description: "There was a problem retrieving the organization details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!organization) return;
    setIsInviting(true);
    try {
      const invitation = await OrganizationService.inviteUser(
        organization.id,
        newMemberEmail
      );
      setInvitations([...invitations, invitation]);
      setNewMemberEmail("");
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${newMemberEmail}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending invitation",
        description: "There was a problem sending the invitation.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateMemberRole = async () => {
    if (!editingMember || !organization) return;
    try {
      const updatedMember = await OrganizationService.updateMemberRole(
        organization.id,
        editingMember.userId,
        editingMember.role
      );
      setMembers(
        members.map((m) =>
          m.userId === updatedMember.userId ? updatedMember : m
        )
      );
      setIsEditingMember(false);
      setEditingMember(null);
      toast({
        title: "Member Updated",
        description: "The member's role has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating member",
        description: "There was a problem updating the member's role.",
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete || !organization) return;
    try {
      await OrganizationService.removeOrganizationMember(
        organization.id,
        memberToDelete
      );
      setMembers(members.filter((m) => m.userId !== memberToDelete));
      setIsDeleteConfirmOpen(false);
      setMemberToDelete(null);
      toast({
        title: "Member Removed",
        description: "The member has been removed from the organization.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error removing member",
        description:
          "There was a problem removing the member from the organization.",
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await OrganizationService.cancelInvitation(invitationId);
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error cancelling invitation",
        description: "There was a problem cancelling the invitation.",
      });
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const updatedInvitation =
        await OrganizationService.resendInvitation(invitationId);
      setInvitations(
        invitations.map((inv) =>
          inv.id === invitationId ? updatedInvitation : inv
        )
      );
      toast({
        title: "Invitation Resent",
        description: "The invitation has been resent successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error resending invitation",
        description: "There was a problem resending the invitation.",
      });
    }
  };

  const filteredMembers = members.filter((member) =>
    member.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvitations = invitations.filter((invitation) =>
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!organization) {
    return <div>No organization found.</div>;
  }

  return (
    <div className="bg-forest-500 min-h-screen text-meadow-100">
      <header className="bg-forest-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-meadow-100">
              {organization.name} - Team Management
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-meadow-500 text-forest-700 hover:bg-meadow-600">
                  <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-forest-600 border-meadow-500">
                <DialogHeader>
                  <DialogTitle className="text-meadow-100">
                    Invite New Team Member
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-meadow-100">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., newmember@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="bg-forest-500 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleInviteMember}
                    disabled={isInviting || !newMemberEmail}
                    className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
                  >
                    {isInviting ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-meadow-300" />
            <Input
              type="text"
              placeholder="Search members or invitations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-forest-600 text-meadow-100 border-meadow-500 focus:ring-meadow-500"
            />
          </div>
        </div>

        <Card className="bg-forest-700 border-meadow-500 mb-8">
          <CardHeader>
            <CardTitle className="text-meadow-100">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-meadow-500 hover:bg-forest-500">
                  <TableHead className="text-meadow-100">User ID</TableHead>
                  <TableHead className="text-meadow-100">Role</TableHead>
                  <TableHead className="text-meadow-100">Joined At</TableHead>
                  <TableHead className="text-meadow-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow
                    key={member.userId}
                    className="border-meadow-500 hover:bg-forest-500"
                  >
                    <TableCell className="font-medium text-meadow-100">
                      {member.userId}
                    </TableCell>
                    <TableCell className="text-meadow-300">
                      {member.role}
                    </TableCell>
                    <TableCell className="text-meadow-300">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingMember(member);
                            setIsEditingMember(true);
                          }}
                          className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMemberToDelete(member.userId);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-forest-700 border-meadow-500">
          <CardHeader>
            <CardTitle className="text-meadow-100">
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-meadow-500 hover:bg-forest-500">
                  <TableHead className="text-meadow-100">Email</TableHead>
                  <TableHead className="text-meadow-100">Invited By</TableHead>
                  <TableHead className="text-meadow-100">Status</TableHead>
                  <TableHead className="text-meadow-100">Expires At</TableHead>
                  <TableHead className="text-meadow-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.map((invitation) => (
                  <TableRow
                    key={invitation.id}
                    className="border-meadow-500 hover:bg-forest-500"
                  >
                    <TableCell className="font-medium text-meadow-100">
                      {invitation.email}
                    </TableCell>
                    <TableCell className="text-meadow-300">
                      {invitation.invitedBy}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invitation.status === "PENDING"
                            ? "secondary"
                            : "default"
                        }
                        className={
                          invitation.status === "PENDING"
                            ? "bg-yellow-500 text-forest-700"
                            : "bg-green-500 text-forest-700"
                        }
                      >
                        {invitation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-meadow-300">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-meadow-300 hover:text-meadow-100 hover:bg-forest-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredMembers.length === 0 && filteredInvitations.length === 0 && (
          <Card className="p-6 text-center bg-forest-600 border-meadow-500 mt-6">
            <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-meadow-100">
              No team members or invitations found
            </h2>
            <p className="text-meadow-300">
              {searchQuery
                ? "No members or invitations match your search. Try adjusting your search terms."
                : "You haven't added any team members or sent any invitations yet. Click 'Invite Member' to get started."}
            </p>
          </Card>
        )}
      </main>

      {/* Edit Member Dialog */}
      <Dialog
        open={isEditingMember}
        onOpenChange={(open) => !open && setIsEditingMember(false)}
      >
        <DialogContent className="bg-forest-600 border-meadow-500">
          <DialogHeader>
            <DialogTitle className="text-meadow-100">
              Edit Team Member Role
            </DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-meadow-100">
                  Role
                </Label>
                <Select
                  onValueChange={(value: UserRole) =>
                    setEditingMember((prev) => ({ ...prev!, role: value }))
                  }
                  defaultValue={editingMember.role}
                >
                  <SelectTrigger className="bg-forest-500 text-meadow-100 border-meadow-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-forest-600 text-meadow-100 border-meadow-500">
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleUpdateMemberRole}
              className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-forest-600 border-meadow-500">
          <DialogHeader>
            <DialogTitle className="text-meadow-100">
              Confirm Removal
            </DialogTitle>
          </DialogHeader>
          <p className="text-meadow-100">
            Are you sure you want to remove this team member? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-forest-500 text-meadow-100 hover:bg-forest-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveMember}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Tooltip */}
      <div className="fixed bottom-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-meadow-500 text-forest-700 hover:bg-meadow-600"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-sm bg-forest-600 text-meadow-100 border-meadow-500"
            >
              <p>
                Need help managing your team? Click here for a quick guide on
                inviting members, managing roles, and handling invitations.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default OrganizationTeamManagement;
