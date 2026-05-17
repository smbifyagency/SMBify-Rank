import type { BlogPostData, SEOContentData, FAQData, TestimonialsData, ServicePageContentData, LocationPageContentData } from "./openai.js";

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

/**
 * Generate SEO content sections using DeepSeek
 */
export async function generateSEOContentWithDeepSeek(
    businessData: any,
    apiKey: string
): Promise<SEOContentData> {
    const systemPrompt = `You are an expert SEO content writer specializing in humanized, conversion-focused content for local businesses.

Business Context:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.heroService || businessData.services}
- Service Areas: ${businessData.serviceAreas || businessData.heroLocation}

HUMANIZED CONTENT REQUIREMENTS:

**Writing Style:**
- Write like a real person talking to another person (use "you" and "we")
- Short, punchy sentences (15-20 words max)
- Simple everyday language - avoid jargon
- Conversational and friendly tone
- Show empathy for customer problems
- Tell stories and use real examples
- Grade 8-9 reading level

**Readability:**
- Short paragraphs (2-3 sentences each)
- Active voice, not passive
- Specific details and numbers
- Vary sentence length for rhythm
- Include emotional appeal

**SEO Optimization:**
- Use semantic keywords naturally (LSI keywords, related terms)
- Include location + service variations
- Primary keywords in first 100 words
- Natural keyword density (1-2%)
- "Near me" intent keywords

**Content Strategy (150-180 words each):**
1. Answer specific customer questions
2. Highlight unique benefits with proof
3. Build trust through local references
4. Include soft CTAs
5. Address pain points directly
6. Show personality and expertise

Return JSON with: seoHeading1, seoContent1, seoHeading2, seoContent2, seoHeading3, seoContent3, seoHeading4, seoContent4, seoHeading5, seoContent5, seoHeading6, seoContent6`;

    const userPrompt = `Generate 6 SEO content sections for ${businessData.businessName}, a ${businessData.category} business in ${businessData.heroLocation}. Focus on local SEO optimization and customer trust factors.`;

    const content = await generateStructuredJsonWithDeepSeek(systemPrompt, userPrompt, apiKey);
    return content as unknown as SEOContentData;
}

/**
 * Generate FAQ questions and answers using DeepSeek
 */
export async function generateFAQContentWithDeepSeek(
    businessData: any,
    apiKey: string
): Promise<FAQData> {
    const systemPrompt = `You are a customer service expert creating helpful, humanized FAQ content that sounds like real conversations.

Business Context:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.heroService || businessData.services}
- Phone: ${businessData.phone}

HUMANIZED FAQ REQUIREMENTS:

**Questions:**
- Sound like real customer questions (natural language)
- Include location references: ${businessData.heroLocation}
- Cover real pain points and concerns
- Use conversational tone
- Include semantic keywords naturally

**Answers (60-100 words each):**
- Write like talking to a friend (warm, friendly)
- Short sentences (15-20 words max)
- Use "you" and "we" pronouns
- Include specific details and numbers
- Address concerns directly
- Build trust and credibility
- End with reassurance or next step
- Avoid corporate jargon

**Topics to Cover:**
1. Main services in this location
2. Pricing transparency
3. Service area/coverage
4. Experience/qualifications
5. Urgent or priority requests
6. Process/timeline
7. Quality guarantee
8. Scheduling/availability
9. Payment/financing
10. Why choose this business

Return JSON with: faqQuestion1, faqAnswer1, faqQuestion2, faqAnswer2, ... through faqQuestion10, faqAnswer10`;

    const userPrompt = `Generate 10 FAQ questions and answers for ${businessData.businessName}, a ${businessData.category} business in ${businessData.heroLocation}. Focus on common customer concerns and local service details.`;

    const content = await generateStructuredJsonWithDeepSeek(systemPrompt, userPrompt, apiKey);
    return content as unknown as FAQData;
}

/**
 * Generate authentic customer testimonials using DeepSeek
 */
export async function generateTestimonialsWithDeepSeek(
    businessData: any,
    apiKey: string
): Promise<TestimonialsData> {
    const systemPrompt = `Create 3 authentic, humanized customer testimonials that sound like real people sharing genuine experiences (not marketing copy).

Business Context:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.heroService || businessData.services}

HUMANIZED TESTIMONIAL REQUIREMENTS:

**Make Them Sound Real:**
- Write like real people talk (casual, natural, conversational)
- Use everyday language - NOT marketing speak
- Include specific details about their actual experience
- Mention real problems they had before
- Add emotional elements (relief, happiness, gratitude, surprise)
- Include minor "imperfections" to sound authentic (casual phrases, contractions)
- Use first-person perspective ("I", "we", "my", "our")
- Vary sentence structure and length naturally

**Content (75-125 words each):**
- Start with the problem/situation they had
- Describe the service/solution they received
- Include a specific standout moment or detail
- Express genuine emotion about the outcome
- Occasionally reference location: ${businessData.heroLocation}
- Use semantic keywords naturally
- All 5-star ratings

**3 Different Angles:**
1. Quality/Results - specific outcome they achieved
2. Experience/Service - how they were treated, the process
3. Value/Recommendation - why others should choose this business

Create realistic, diverse customer names.

Return JSON: testimonial1Name, testimonial1Text, testimonial1Rating (5), testimonial2Name, testimonial2Text, testimonial2Rating (5), testimonial3Name, testimonial3Text, testimonial3Rating (5)`;

    const userPrompt = `Generate 3 realistic customer testimonials for ${businessData.businessName}, a ${businessData.category} business in ${businessData.heroLocation}. Make them sound authentic and specific to the service type.`;

    const content = await generateStructuredJsonWithDeepSeek(systemPrompt, userPrompt, apiKey);
    const parsed = content as unknown as TestimonialsData;
    parsed.testimonial1Rating = 5;
    parsed.testimonial2Rating = 5;
    parsed.testimonial3Rating = 5;
    return parsed;
}

/**
 * Generate service page content using DeepSeek
 */
export async function generateServicePageContentWithDeepSeek(
    serviceName: string,
    businessContext: any,
    apiKey: string
): Promise<ServicePageContentData> {
    const systemPrompt = `You are a professional copywriter specializing in service pages for local businesses. Create comprehensive, engaging content for a specific service page that will help customers understand the service and convert them into customers.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Years in Business: ${businessContext.yearsInBusiness}
- Phone: ${businessContext.phone}
- Service Focus: ${serviceName}

Guidelines:
- Create compelling, informative content that builds trust and expertise
- Include specific details about the service process and benefits
- Address common customer concerns and questions
- Use local SEO keywords naturally
- Maintain professional yet approachable tone
- Focus on customer value and problem-solving
- Include actionable information customers can use

Return the response as a JSON object with these exact fields:
{
  "serviceDescription": "Comprehensive description of the specific service (200-250 words)",
  "processSteps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7"],
  "whyChooseForService": "Why customers should choose this business for this specific service (150-200 words)",
  "commonIssues": ["Issue 1", "Issue 2", "Issue 3", "Issue 4", "Issue 5", "Issue 6"],
  "serviceFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
  "qualityAssurance": "Quality guarantee and assurance information (150-200 words)",
  "metaTitle": "SEO-optimized title (60 characters max)",
  "metaDescription": "SEO meta description (150-160 characters)",
  "heroDescription": "Compelling hero section description (100-150 words)"
}`;

    const userPrompt = `Generate comprehensive content for a ${serviceName} service page for ${businessContext.businessName}, a ${businessContext.category} business in ${businessContext.heroLocation}. Focus on local expertise and customer benefits.`;

    const content = await generateStructuredJsonWithDeepSeek(systemPrompt, userPrompt, apiKey);
    return content as unknown as ServicePageContentData;
}

/**
 * Generate location page content using DeepSeek
 */
export async function generateLocationPageContentWithDeepSeek(
    locationName: string,
    businessContext: any,
    apiKey: string
): Promise<LocationPageContentData> {
    const systemPrompt = `You are a professional copywriter specializing in location pages for local businesses. Create compelling, localized content for a specific location page that demonstrates local expertise and builds trust with customers in that area.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Main Location: ${businessContext.heroLocation}
- Years in Business: ${businessContext.yearsInBusiness}
- Phone: ${businessContext.phone}
- Service Type: ${businessContext.heroService}
- Target Location: ${locationName}

Guidelines:
- Emphasize local knowledge and community connection
- Include location-specific details and benefits
- Address unique challenges or opportunities in this location
- Use local SEO keywords naturally
- Build trust through local expertise claims
- Create urgency for customers in this specific area
- Maintain professional, community-focused tone

Return the response as a JSON object with these exact fields:
{
  "heroDescription": "Compelling hero description for this location (150-200 words)",
  "aboutContent": "About section focused on local expertise (200-250 words)",
  "whyChooseContent": "Why choose this business in this specific location (150-200 words)",
  "serviceAreasContent": "Service area coverage details for this location (100-150 words)",
  "emergencyContent": "Urgent service or priority availability in this location (100-150 words)",
  "localBenefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5", "Benefit 6"],
  "metaTitle": "SEO-optimized title for this location (60 characters max)",
  "metaDescription": "SEO meta description for this location (150-160 characters)"
}`;

    const userPrompt = `Generate comprehensive location-specific content for ${locationName} for ${businessContext.businessName}, a ${businessContext.category} business serving ${locationName} from ${businessContext.heroLocation}. Focus on local expertise and community connection.`;

    const content = await generateStructuredJsonWithDeepSeek(systemPrompt, userPrompt, apiKey);
    return content as unknown as LocationPageContentData;
}

