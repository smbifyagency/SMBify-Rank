import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { z } from "zod";

const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["user", "paid", "admin"], {
    required_error: "Please select a role",
  }),
  websiteLimit: z.number().min(0, "Website limit must be at least 0").max(1000, "Website limit cannot exceed 1000"),
  expiryDate: z.string().optional(),
  isActive: z.boolean(),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  websiteLimit: number | null;
  websitesCreated: number | null;
  isActive: boolean;
  expiryDate: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditUserFormProps {
  user: User;
  onUserUpdated?: () => void;
}

export function EditUserForm({ user, onUserUpdated }: EditUserFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: (["user", "paid", "admin"].includes(user.role) ? user.role : "user") as "user" | "paid" | "admin",
      websiteLimit: user.websiteLimit || 10,
      expiryDate: user.expiryDate ? new Date(user.expiryDate).toISOString().split('T')[0] : "",
      isActive: user.isActive,
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: (["user", "paid", "admin"].includes(user.role) ? user.role : "user") as "user" | "paid" | "admin",
      websiteLimit: user.websiteLimit || 10,
      expiryDate: user.expiryDate ? new Date(user.expiryDate).toISOString().split('T')[0] : "",
      isActive: user.isActive,
    });
  }, [user, form]);

  const editUserMutation = useMutation({
    mutationFn: async (data: EditUserData) => {
      const response = await fetch(`/api/users/${user.id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          expiryDate: data.expiryDate || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setOpen(false);
      onUserUpdated?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditUserData) => {
    editUserMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" data-testid={`button-edit-user-${user.id}`}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user settings and permissions for {user.email}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} data-testid="input-first-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Free User (3 sites)</SelectItem>
                      <SelectItem value="paid">Paid User (Unlimited)</SelectItem>
                      <SelectItem value="admin">Admin (Unlimited + Management)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Creation Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      placeholder="10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-website-limit"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm text-muted-foreground">
                    Current usage: {user.websitesCreated || 0} websites created (max: 1000)
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-expiry-date"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm text-muted-foreground">
                    Leave empty for no expiry. User access will be disabled after this date.
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Account Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable user access to the system
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-is-active"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editUserMutation.isPending}
                data-testid="button-save-user"
              >
                {editUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}