"use client";
import React, { useState, useEffect } from "react";
import { 
  UserCog, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  Mail,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDetailDrawer from "@/components/admin/UserDetailDrawer";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    Admin: "bg-purple-50 text-purple-700 border-purple-100",
    Agency: "bg-blue-50 text-blue-700 border-blue-100",
    Agent: "bg-slate-50 text-slate-700 border-slate-100",
    Buyer: "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Accounts</h1>
          <p className="text-slate-500 text-sm">Monitor system access, roles, and security settings across all users.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by username or email..." className="pl-10 bg-slate-50 border-none" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-slate-600">
            <Filter className="h-4 w-4 mr-2" /> All Roles
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Identity</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>2FA Security</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">Loading user database...</TableCell></TableRow>
            ) : users.map((user) => (
              <TableRow key={user._id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 italic">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${roleColors[user.role]} shadow-none font-medium border`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                     user.status === 'Active' ? 'text-green-600' : 'text-red-500'
                   }`}>
                     {user.status}
                   </span>
                </TableCell>
                <TableCell>
                  {user.twoFactorEnabled ? (
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-xs font-medium">Enabled</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Disabled</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setIsDrawerOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        userId={selectedUserId}
        refresh={fetchUsers}
      />
    </div>
  );
}