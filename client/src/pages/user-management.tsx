import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { AddUserForm } from "@/components/add-user-form";
import { EditUserForm } from "@/components/edit-user-form";
import { Users, UserPlus, Shield, ShieldCheck, Trash2, Calendar, Clock } from "lucide-react";

export default function UserManagement() {
  const { toast } = useToast();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = currentUser && ((currentUser as any).role === "admin" || (currentUser as any).id === "admin");

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!isAdmin,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You need admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#7C3AED] mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-gray-400">Manage user accounts and permissions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <AddUserForm />
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        {/* User List */}
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {(users as any)?.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                ) : (
                  (users as any)?.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-white/10 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.firstName || "User"}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/25 flex items-center justify-center">
                              <span className="text-sm font-medium text-[#9333EA]">
                                {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-white">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email || "Unknown User"}
                            </p>
                            <Badge
                              variant="default"
                              className={`flex items-center ${user.role === 'admin' ? 'bg-red-600' :
                                user.role === 'paid' ? 'bg-emerald-600' :
                                  'bg-[#7C3AED]'
                                }`}
                            >
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              {user.role === 'admin' ? 'Admin' :
                                user.role === 'paid' ? 'Paid' :
                                  'Free User'}
                            </Badge>
                            {!user.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.lastLoginAt && (
                            <p className="text-xs text-gray-400">
                              Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-xs text-[#7C3AED] font-medium">
                            Websites: {user.websitesCreated || 0} / {user.websiteLimit || 10}
                          </p>
                          {user.expiryDate && (
                            <div className="flex items-center text-xs text-amber-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                Expires: {new Date(user.expiryDate).toLocaleDateString()}
                                {new Date(user.expiryDate) < new Date() && (
                                  <Badge variant="destructive" className="ml-2 text-xs">Expired</Badge>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.id !== (currentUser as any)?.id && (
                          <>
                            <EditUserForm user={user} />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this user? This action cannot be undone."
                                  )
                                ) {
                                  deleteUserMutation.mutate(user.id);
                                }
                              }}
                              disabled={deleteUserMutation.isPending}
                              data-testid={`button-delete-${user.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Authentication Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white">User Registration</h4>
                <p className="text-sm text-gray-400">
                  New users are automatically registered when they sign in for the first time.
                  They start with "user" role by default.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white">Role Management</h4>
                <p className="text-sm text-gray-400">
                  Admin users can promote other users to admin or demote them to regular users.
                  Admin users have access to user management and all system settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white">Authentication Provider</h4>
                <p className="text-sm text-gray-400">
                  Authentication is handled securely through Replit Auth with OpenID Connect.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}