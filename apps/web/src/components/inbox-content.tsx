import React, { useState } from "react";
import { format } from "date-fns";
import { Mail, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for emails
const mockEmails = [
  {
    id: 1,
    from: "john@example.com",
    subject: "Weekly Team Meeting",
    preview: "Hi team, just a reminder about our weekly...",
    date: new Date(2024, 7, 1, 9, 0),
    isStarred: false,
    isRead: false,
  },
  {
    id: 2,
    from: "sarah@example.com",
    subject: "Project Update: Q3 Goals",
    preview: "Hello everyone, I wanted to share an update on our Q3 goals...",
    date: new Date(2024, 7, 1, 10, 30),
    isStarred: true,
    isRead: true,
  },
  {
    id: 3,
    from: "marketing@company.com",
    subject: "New Product Launch",
    preview: "Exciting news! Were launching our new product line next month...",
    date: new Date(2024, 7, 1, 14, 15),
    isStarred: false,
    isRead: false,
  },
  // Add more mock emails as needed
];

export function InboxContent() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);

  const toggleStar = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedEmails((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((emailId) => emailId !== id)
        : [...prevSelected, id]
    );
  };

  const deleteSelected = () => {
    setEmails(emails.filter((email) => !selectedEmails.includes(email.id)));
    setSelectedEmails([]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Inbox</h2>
        <div className="flex gap-2">
          <Input type="text" placeholder="Search emails..." className="w-64" />
          <Button
            variant="destructive"
            onClick={deleteSelected}
            disabled={selectedEmails.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id}
              className={email.isRead ? "" : "font-bold"}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(email.id)}
                  onChange={() => toggleSelect(email.id)}
                  className="mr-2"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStar(email.id)}
                >
                  <Star
                    className={`h-4 w-4 ${email.isStarred ? "text-yellow-400 fill-yellow-400" : ""}`}
                  />
                </Button>
              </TableCell>
              <TableCell>{email.from}</TableCell>
              <TableCell>{email.subject}</TableCell>
              <TableCell className="max-w-xs truncate">
                {email.preview}
              </TableCell>
              <TableCell className="text-right">
                {format(email.date, "MMM d, h:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
