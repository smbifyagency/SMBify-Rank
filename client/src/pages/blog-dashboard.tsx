import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Search, Filter, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  status: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
  isAiGenerated: boolean;
}

interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
}

export default function BlogDashboard() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [postsPerPage] = useState(10);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts with pagination
  const { data: postsData, isLoading } = useQuery<BlogPostsResponse>({
    queryKey: ["/api/admin/blog-posts", currentPage, postsPerPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/blog-posts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Post deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      apiRequest("POST", "/api/admin/blog-posts/bulk-delete", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setSelectedPosts([]);
      toast({ title: "Posts deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete posts", description: error.message, variant: "destructive" });
    },
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/blog-posts/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Post status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && postsData) {
      setSelectedPosts(postsData.posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPosts = postsData?.posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((postsData?.total || 0) / postsPerPage);

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Blog Management</h1>
            <p className="text-gray-400">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <Link href="/blog-editor">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{postsData?.total || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {postsData?.posts.filter(p => p.status === "published").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {postsData?.posts.filter(p => p.status === "draft").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {postsData?.posts.reduce((sum, p) => sum + (p.viewCount || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6 bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPosts.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => bulkDeleteMutation.mutate(selectedPosts)}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedPosts.length})
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10 hover:bg-white/5">
                    <TableHead className="w-12 text-gray-400">
                      <Checkbox
                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="border-gray-500 data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                      />
                    </TableHead>
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Author</TableHead>
                    <TableHead className="text-gray-400">Published</TableHead>
                    <TableHead className="text-gray-400">Views</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="border-b border-white/10 hover:bg-white/5 data-[state=selected]:bg-white/5">
                      <TableCell>
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={(checked) => handleSelectPost(post.id, !!checked)}
                          className="border-gray-500 data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-white">{post.title}</div>
                          <div className="text-sm text-gray-400 truncate max-w-md">
                            {post.excerpt}
                          </div>
                          {post.isAiGenerated && (
                            <Badge variant="outline" className="text-xs border-[#7C3AED]/25 text-[#9333EA]">
                              AI Generated
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{post.category || "Uncategorized"}</TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell className="text-gray-300">{post.authorName}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(post.publishedAt)}</TableCell>
                      <TableCell className="text-gray-300">{post.viewCount || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-white/10 text-white">
                            <Link href={`/blog/${post.slug}`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/blog-editor/${post.id}`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() => statusMutation.mutate({
                                id: post.id,
                                status: post.status === "published" ? "draft" : "published"
                              })}
                              className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              {post.status === "published" ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteMutation.mutate(post.id)}
                              className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}