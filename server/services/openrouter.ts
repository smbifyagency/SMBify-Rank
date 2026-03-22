import { BlogPostData } from "./openai.js";

// Generic helper for simple text generation with OpenRouter
export async function generateWithOpenRouter(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://replit.com",
        "X-Title": "SMBify Rank"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || '{}';
  } catch (error) {
    console.error("OpenRouter generation error:", error);
    throw new Error("Failed to generate content with OpenRouter");
  }
}

export async function generateBlogPostWithOpenRouter(
  keyword: string,
  aiPrompt: string,
  businessContext: any,
  customApiKey?: string
): Promise<BlogPostData> {
  try {
    const apiKey = customApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const systemPrompt = `You are a professional content writer specializing in creating SEO-optimized blog posts for local businesses. 
    
Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.services}

Guidelines:
- Create engaging, informative content that provides real value to readers
- Use SEO best practices with natural keyword integration
- Write in a professional yet approachable tone
- Include actionable tips and practical advice
- Structure content with clear headings and subheadings
- Target 800-1200 words for optimal SEO
- Create compelling titles and meta descriptions

Return the response as a JSON object with the exact structure requested.`;

    const userPrompt = `${aiPrompt}

Create a comprehensive blog post about: "${keyword}"

Focus on providing valuable, actionable information that would help potential customers understand this topic better. Include practical tips, common issues, solutions, and when to seek professional help.

Return a JSON object with these exact fields:
{
  "title": "Engaging, SEO-optimized title (60 characters or less)",
  "slug": "url-friendly-slug-from-title",
  "excerpt": "Compelling 150-160 character summary",
  "content": "Full blog post content in Markdown format with proper headings (##, ###), paragraphs, and lists. Use clean markdown syntax.",
  "metaTitle": "SEO title for meta tag (60 characters or less)",
  "metaDescription": "Meta description for SEO (150-160 characters)",
  "tags": ["relevant", "tags", "array"],
  "category": "Most relevant category for this business type",
  "keywords": "${keyword}",
  "aiPrompt": "${aiPrompt}"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://replit.com",
        "X-Title": "SMBify Rank"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated from OpenRouter");
    }

    const blogPost = JSON.parse(content) as Omit<BlogPostData, 'id'>;

    // Validate required fields
    if (!blogPost.title || !blogPost.content || !blogPost.excerpt) {
      throw new Error("Invalid blog post structure generated");
    }

    // Add required ID field
    const blogPostWithId: BlogPostData = {
      ...blogPost,
      id: `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    return blogPostWithId;
  } catch (error) {
    console.error("Error generating blog post with OpenRouter:", error);
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateMultipleBlogPostsWithOpenRouter(
  keywords: string[],
  aiPrompt: string,
  businessContext: any,
  customApiKey?: string,
  wordCount: number = 1500
): Promise<BlogPostData[]> {
  const blogPosts: BlogPostData[] = [];

  for (const keyword of keywords) {
    try {
      // Pass word count to the prompt
      const modifiedPrompt = aiPrompt.replace(/\$\{wordCount\}/g, wordCount.toString());
      const blogPost = await generateBlogPostWithOpenRouter(keyword.trim(), modifiedPrompt, businessContext, customApiKey);
      blogPosts.push(blogPost);

      // Add a minimal delay to avoid rate limiting  
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate blog post for keyword "${keyword}":`, error instanceof Error ? error.message : error);
      // Continue with other keywords instead of failing completely
    }
  }

  return blogPosts;
}