import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, User, ArrowRight, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  tags?: string[];
  authorName: string;
  publishedAt: string;
  readingTime?: number;
  viewCount?: number;
  isAiGenerated: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function BlogArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch published blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Fetch categories for filtering
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/admin/blog-categories"],
  });

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFeaturedPosts = () => {
    return filteredPosts.slice(0, 3);
  };

  const getRecentPosts = () => {
    return filteredPosts.slice(3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
            Our Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights, tips, and stories from our team. Stay updated with the latest trends and best practices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]"
            />
          </div>

          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white focus:ring-0 focus:ring-offset-0">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchQuery || selectedCategory !== "all"
                ? "No articles found matching your criteria."
                : "No blog posts available yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {getFeaturedPosts().length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-white">Featured Articles</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {getFeaturedPosts().map((post) => (
                    <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/[0.02] border-white/10 backdrop-blur-sm">
                      {post.featuredImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.featuredImageAlt || post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.isAiGenerated && (
                            <Badge className="absolute top-3 right-3 bg-[#7C3AED] hover:bg-[#9333EA] text-black text-white border-0">
                              AI Generated
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                          {post.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readingTime} min read
                            </div>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-[#7C3AED] text-white transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-gray-400">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="h-3 w-3" />
                            {post.authorName}
                            <Calendar className="h-3 w-3 ml-2" />
                            {formatDate(post.publishedAt)}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 group-hover:translate-x-1 transition-transform">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-white/5 text-gray-300 hover:bg-white/10 border-0">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-white/5 text-gray-300 hover:bg-white/10 border-0">
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {getRecentPosts().length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-white">Recent Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {getRecentPosts().map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 bg-white/[0.02] border-white/10 backdrop-blur-sm">
                      {post.featuredImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.featuredImageAlt || post.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.isAiGenerated && (
                            <Badge className="absolute top-2 right-2 bg-[#7C3AED] hover:bg-[#9333EA] text-black text-white text-xs border-0">
                              AI
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                          {post.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readingTime} min
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-[#7C3AED] text-white transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm text-gray-400">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.authorName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="w-full mt-3 border-white/10 text-gray-300 bg-transparent hover:text-white hover:bg-white/5 transition-colors">
                            Read More
                            <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-[#7C3AED]/25">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Stay Updated</CardTitle>
              <CardDescription className="text-gray-300">
                Get the latest articles and insights delivered straight to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-[#7C3AED]"
                />
                <Button className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold text-white border-0">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}