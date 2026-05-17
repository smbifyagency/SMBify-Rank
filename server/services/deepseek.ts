import type { BlogPostData } from "./openai.js";

// DeepSeek API configuration
const DEEPSEEK_API_BASE = "https://api.deepseek.com/v1";
const DEEPSEEK_MODEL = "deepseek-chat"; // Auto-selects latest model (deepseek-v3, deepseek-r1, etc.)

/**
 * Generate content using DeepSeek's latest model
 * DeepSeek automatically routes to its newest available model
 */
export async function generateWithDeepSeek(
    prompt: string,
    apiKey: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        responseFormat?: "json_object" | "text";
    } = {}
): Promise<string> {
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 8000;
    const responseFormat = options.responseFormat ?? "json_object";

    try {
        const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert SEO content writer and local business marketing specialist. You write like a real person — clear, specific, and helpful. You never use marketing fluff, buzzwords, or generic filler. Every sentence adds value.",
                    },
                    { role: "user", content: prompt },
                ],
                response_format:
                    responseFormat === "json_object"
                        ? { type: "json_object" }
                        : undefined,
                temperature,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            throw new Error(
                `DeepSeek API error (${response.status}): ${errorBody || response.statusText}`
            );
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } catch (error) {
        console.error("DeepSeek generation error:", error);
        throw error;
    }
}

/**
 * Generate structured JSON content using DeepSeek
 */
export async function generateStructuredJsonWithDeepSeek(
    systemPrompt: string,
    userPrompt: string,
    apiKey: string,
    options: { maxTokens?: number; temperature?: number } = {}
): Promise<Record<string, any>> {
    const maxTokens = options.maxTokens ?? 6000;
    const temperature = options.temperature ?? 0.65;

    try {
        const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
                temperature,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "{}";

        // Parse and sanitize JSON response
        try {
            return JSON.parse(content);
        } catch {
            // Try to extract JSON from code fences
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            return {};
        }
    } catch (error) {
        console.error("DeepSeek structured JSON generation error:", error);
        throw error;
    }
}

/**
 * Generate a blog post using DeepSeek
 */
export async function generateBlogPostWithDeepSeek(
    keyword: string,
    aiPrompt: string,
    businessContext: any,
    customApiKey?: string
): Promise<BlogPostData> {
    try {
        const apiKey = customApiKey || process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            throw new Error("DeepSeek API key not configured");
        }

        const systemPrompt = `You are a local business expert who writes blog posts that real people want to read. You have 15 years of hands-on experience in the ${businessContext.category} industry.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.services}
- Service Areas: ${businessContext.serviceAreas || businessContext.heroLocation}
- Target Keyword: "${keyword}"

HUMANIZED BLOG POST REQUIREMENTS:

**Writing Style:**
- Write like you're having a conversation with the reader
- Use "you" and "we" throughout
- Short sentences (15-20 words average)
- Short paragraphs (2-4 sentences max)
- Active voice, not passive
- Tell stories and use real examples
- Show personality and emotion
- Grade 8-9 reading level

**Structure (1500-1800 words):**
- Compelling intro (hook + problem + promise)
- 5-7 main sections with H2 headings
- Subsections with H3 headings where needed
- Bullet points and numbered lists
- Real examples and specific details
- FAQ section (3-5 questions)
- Strong conclusion with clear CTA

**SEO Optimization:**
- Primary keyword: "${keyword}"
- Use keyword in: title, first 100 words, H2s (1-2), naturally throughout
- LSI/semantic keywords: include related terms naturally
- Location keywords: ${businessContext.heroLocation} + service variations
- Internal topic connections
- Natural keyword density (1-2%)

**Content Quality:**
- Answer searcher intent completely
- Include actionable tips and advice
- Add specific numbers, data, timeframes
- Address common objections
- Build trust and authority
- Solve real problems
- Engage emotions

Return JSON:
{
  "title": "Engaging, keyword-rich title (60 chars max)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling summary with keyword (150-160 chars)",
  "content": "Full humanized blog post in Markdown (1500-1800 words)",
  "metaTitle": "SEO title with keyword (60 chars max)",
  "metaDescription": "Benefit-focused meta with keyword (150-160 chars)",
  "tags": ["relevant", "semantic", "keywords"],
  "category": "Relevant category",
  "keywords": "${keyword}",
  "aiPrompt": "${aiPrompt}"
}`;

        const content = await generateWithDeepSeek(systemPrompt, apiKey, {
            maxTokens: 8000,
            temperature: 0.75,
        });

        const blogPost = JSON.parse(content) as Omit<BlogPostData, "id">;

        // Validate required fields
        if (!blogPost.title || !blogPost.content || !blogPost.excerpt) {
            throw new Error("Invalid blog post structure generated");
        }

        // Add unique ID
        const blogPostWithId: BlogPostData = {
            ...blogPost,
            id: `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        return blogPostWithId;
    } catch (error) {
        console.error("Error generating blog post with DeepSeek:", error);
        throw new Error(
            `Failed to generate blog post: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Generate multiple blog posts with DeepSeek
 */
export async function generateMultipleBlogPostsWithDeepSeek(
    keywords: string[],
    aiPrompt: string,
    businessContext: any,
    customApiKey?: string,
    wordCount: number = 1500
): Promise<BlogPostData[]> {
    const blogPosts: BlogPostData[] = [];

    for (const keyword of keywords) {
        try {
            const modifiedPrompt = aiPrompt.replace(
                /\$\{wordCount\}/g,
                wordCount.toString()
            );
            const blogPost = await generateBlogPostWithDeepSeek(
                keyword.trim(),
                modifiedPrompt,
                businessContext,
                customApiKey
            );
            blogPosts.push(blogPost);

            // Add a delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
            console.error(
                `Failed to generate blog post for keyword "${keyword}":`,
                error instanceof Error ? error.message : error
            );
        }
    }

    return blogPosts;
}
