import { GoogleGenerativeAI } from "@google/generative-ai";

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  tags: string[];
  keywords: string;
  aiPrompt: string;
}

// Blog post generation with Gemini
export async function generateBlogPostWithGemini(
  keyword: string,
  aiPrompt: string,
  businessContext: any,
  customApiKey?: string
): Promise<BlogPostData> {
  try {
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const systemPrompt = `You are an expert SEO content writer creating humanized, engaging blog posts that readers love AND search engines rank.

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

    const content = await generateWithGemini(systemPrompt, apiKey);
    const blogPost = JSON.parse(content);

    // Add unique ID
    const blogPostWithId: BlogPostData = {
      ...blogPost,
      id: `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Add fallback featured image if none provided
    if (!blogPostWithId.featuredImage) {
      blogPostWithId.featuredImage =
        `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format`;
      blogPostWithId.featuredImageAlt = `${businessContext.category} - ${keyword}`;
    }

    return blogPostWithId;
  } catch (error) {
    console.error("Error generating blog post with Gemini:", error);
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generic helper for simple text generation with Gemini
export async function generateWithGemini(prompt: string, apiKey: string): Promise<string> {
  const ai = getGeminiClient(apiKey);

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      console.warn("Gemini returned empty response, using empty JSON");
      return '{}';
    }

    return text;
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
    });
    throw new Error(`Failed to generate content with Gemini: ${error?.message || 'Unknown error'}`);
  }
}

// Initialize Gemini client only when API key is available
function getGeminiClient(customApiKey?: string): GoogleGenerativeAI {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is required for AI-powered features");
  }

  return new GoogleGenerativeAI(apiKey);
}

export async function generateSEOContentWithGemini(businessData: any, apiKey: string): Promise<any> {
  const ai = getGeminiClient(apiKey);

  const prompt = `You are an expert SEO content writer specializing in humanized, conversion-focused content for local businesses.

Business Context:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.services}
- Target Keywords: ${businessData.targetedKeywords}

CONTENT WRITING REQUIREMENTS:

1. **Humanized & Natural Writing**:
   - Write like a real person talking to another person
   - Use conversational tone with "you" and "we"
   - Short sentences (15-20 words max)
   - Simple, everyday language - avoid jargon
   - Tell stories and use examples
   - Show empathy for customer problems

2. **Easy to Read**:
   - Short paragraphs (2-3 sentences each)
   - Use active voice, not passive
   - Clear, straightforward language
   - Vary sentence length for rhythm
   - Include specific details and numbers
   - Grade 8-9 reading level

3. **Semantic Keywords Optimization**:
   - Use LSI (Latent Semantic Indexing) keywords naturally
   - Include related terms and synonyms: ${businessData.targetedKeywords}
   - Add industry-specific terminology
   - Use location + service variations
   - Include "near me" intent keywords
   - Natural keyword density (1-2%)

4. **Primary Keyword Optimization**:
   - Main keywords: ${businessData.targetedKeywords}
   - Location keywords: ${businessData.heroLocation}
   - Place keywords in first 100 words
   - Use in headings where natural
   - Include in call-to-action phrases

Create 6 unique content sections (150-180 words each) that:
- Answer specific customer questions
- Highlight unique benefits
- Build trust and credibility
- Include local references
- Add emotional appeal
- End with soft CTAs

Return JSON with this structure:
{
  "seoHeading1": "Customer-focused heading with primary keyword",
  "seoContent1": "Humanized, easy-to-read content with semantic keywords",
  "seoHeading2": "Problem-solving heading",
  "seoContent2": "Conversational content addressing pain points",
  "seoHeading3": "Local expertise heading with location",
  "seoContent3": "Trust-building content with local references",
  "seoHeading4": "Benefit-focused heading",
  "seoContent4": "Value-driven content with specific examples",
  "seoHeading5": "Service-focused heading",
  "seoContent5": "Solution-oriented content with details",
  "seoHeading6": "Social proof or guarantee heading",
  "seoContent6": "Credibility-building content with assurance"
}`;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned empty response for SEO content");
    }

    const parsedResult = JSON.parse(text);
    return parsedResult;
  } catch (error: any) {
    console.error("Gemini SEO generation error:", error);
    console.error("Error details:", error?.message);
    throw new Error(`Failed to generate SEO content with Gemini: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateFAQContentWithGemini(businessData: any, apiKey: string): Promise<any> {
  const ai = getGeminiClient(apiKey);

  const prompt = `You are a customer service expert creating helpful, humanized FAQ content for a local business.

Business Context:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.services}
- Keywords: ${businessData.targetedKeywords}

FAQ WRITING REQUIREMENTS:

**Questions Should:**
- Sound like real customer questions
- Include target keywords naturally: ${businessData.targetedKeywords}
- Cover customer pain points and concerns
- Use conversational language
- Include location references where relevant

**Answers Should:**
- Be conversational and friendly (like talking to a friend)
- Use short sentences (15-20 words max)
- Include specific details and numbers
- Address concerns directly
- Build trust and credibility
- Use semantic keywords naturally
- Include "you" and "we" pronouns
- Be 2-4 sentences (60-100 words)
- End with reassurance or next step

Create 10 FAQ pairs covering:
1. Main services in ${businessData.heroLocation}
2. Pricing transparency
3. Service area/coverage
4. Experience/qualifications
5. Urgent or priority requests
6. Process/timeline
7. Quality guarantee
8. Scheduling/availability
9. Payment/financing
10. Why choose this business

Return JSON: faqQuestion1, faqAnswer1, faqQuestion2, faqAnswer2, ... through faqQuestion10, faqAnswer10`;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned empty response for FAQ content");
    }

    const parsedResult = JSON.parse(text);
    return parsedResult;
  } catch (error: any) {
    console.error("Gemini FAQ generation error:", error);
    console.error("Error details:", error?.message);
    throw new Error(`Failed to generate FAQ content with Gemini: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateTestimonialsWithGemini(businessData: any, apiKey: string): Promise<any> {
  const ai = getGeminiClient(apiKey);

  const prompt = `Create 3 authentic, humanized customer testimonials that sound like real people sharing their genuine experience.

Business Context:
- Business: ${businessData.businessName}
- Category: ${businessData.category}
- Location: ${businessData.heroLocation}
- Services: ${businessData.services}

TESTIMONIAL WRITING REQUIREMENTS:

**Make Them Sound Real:**
- Write like real people talk (casual, natural)
- Use everyday language, not marketing speak
- Include specific details about the experience
- Mention actual service/product details
- Add emotional elements (relief, happiness, surprise)
- Include minor imperfections to sound authentic
- Use first-person perspective ("I", "we", "my")
- Vary sentence structure and length

**Content Guidelines:**
- 3-5 sentences (75-125 words)
- Mention specific problem they had
- Describe the solution/service received
- Include a standout moment or detail
- Express genuine emotion or outcome
- Reference location occasionally: ${businessData.heroLocation}
- Use semantic keywords naturally
- All 5-star ratings

**3 Different Angles:**
1. Quality/Results focus - specific outcome achieved
2. Experience/Service focus - how they were treated
3. Value/Recommendation focus - why others should choose them

Customer names should be realistic and diverse.

Return JSON: testimonial1Name, testimonial1Text, testimonial1Rating (5), testimonial2Name, testimonial2Text, testimonial2Rating (5), testimonial3Name, testimonial3Text, testimonial3Rating (5)`;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned empty response for testimonials");
    }

    const parsedResult = JSON.parse(text);
    return parsedResult;
  } catch (error: any) {
    console.error("Gemini testimonials generation error:", error);
    console.error("Error details:", error?.message);
    throw new Error(`Failed to generate testimonials with Gemini: ${error?.message || 'Unknown error'}`);
  }
}