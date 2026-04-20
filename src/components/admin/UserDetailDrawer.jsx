"use client";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShieldAlert,
  Trash2,
  UserCheck,
  Mail,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";

export default function UserDetailDrawer({ isOpen, onClose, userId, refresh }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch(`/api/admin/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  const updateStatus = async (status) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      refresh();
      onClose();
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure? This action is permanent!")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      refresh();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md bg-white border-l">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
            User Profile Management
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Top Identity Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">@{user.username}</p>
            <Badge variant="secondary" className="mt-3 px-4">
              {user.role}
            </Badge>
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator />

          {/* Core Admin Actions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Administrative Actions
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {user.status === "Active" ? (
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-100 hover:bg-red-50"
                  onClick={() => updateStatus("Suspended")}
                >
                  <Lock className="mr-2 h-4 w-4" /> Suspend Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-100 hover:bg-green-50"
                  onClick={() => updateStatus("Active")}
                >
                  <Unlock className="mr-2 h-4 w-4" /> Restore Account
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full text-blue-600 border-blue-100 hover:bg-blue-50"
                onClick={() => updateStatus(user.status, !user.isVerified)}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {user.isVerified ? "Revoke Verification" : "Verify Manually"}
              </Button>

              <Separator className="my-2" />

              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 font-bold"
                onClick={deleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account Permanently
              </Button>
            </div>
          </div>

          {/* Note Section */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Admin Notice:</strong> Deleting a user will remove all
              their saved properties and preferences. This action cannot be
              undone.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
