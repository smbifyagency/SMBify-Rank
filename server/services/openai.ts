import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

// Initialize OpenAI client only when API key is available
function getOpenAIClient(customApiKey?: string): OpenAI {
  const apiKey = customApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is required for AI-powered features");
  }

  // If using a custom API key, create a new client each time
  if (customApiKey) {
    return new OpenAI({ apiKey: customApiKey });
  }

  // Otherwise, use the cached client for env variable
  if (!openai) {
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  category: string;
  keywords: string;
  aiPrompt: string;
  featuredImage?: string;
  featuredImageAlt?: string;
}

export interface UnsplashImage {
  url: string;
  alt: string;
  credit: string;
  downloadUrl: string;
}

export interface SEOContentData {
  seoHeading1: string;
  seoContent1: string;
  seoHeading2: string;
  seoContent2: string;
  seoHeading3: string;
  seoContent3: string;
  seoHeading4: string;
  seoContent4: string;
  seoHeading5: string;
  seoContent5: string;
  seoHeading6: string;
  seoContent6: string;
}

export interface FAQData {
  faqQuestion1: string;
  faqAnswer1: string;
  faqQuestion2: string;
  faqAnswer2: string;
  faqQuestion3: string;
  faqAnswer3: string;
  faqQuestion4: string;
  faqAnswer4: string;
  faqQuestion5: string;
  faqAnswer5: string;
  faqQuestion6: string;
  faqAnswer6: string;
  faqQuestion7: string;
  faqAnswer7: string;
  faqQuestion8: string;
  faqAnswer8: string;
  faqQuestion9: string;
  faqAnswer9: string;
  faqQuestion10: string;
  faqAnswer10: string;
}

export interface TestimonialsData {
  testimonial1Name: string;
  testimonial1Text: string;
  testimonial1Rating: number;
  testimonial2Name: string;
  testimonial2Text: string;
  testimonial2Rating: number;
  testimonial3Name: string;
  testimonial3Text: string;
  testimonial3Rating: number;
}

export interface ServicePageContentData {
  serviceDescription: string;
  processSteps: string[];
  whyChooseForService: string;
  commonIssues: string[];
  serviceFeatures: string[];
  qualityAssurance: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
}

export interface LocationPageContentData {
  heroDescription: string;
  aboutContent: string;
  whyChooseContent: string;
  serviceAreasContent: string;
  emergencyContent: string;
  localBenefits: string[];
  metaTitle: string;
  metaDescription: string;
}

export async function generateBlogPost(
  keyword: string,
  aiPrompt: string,
  businessContext: any,
  customApiKey?: string,
  unsplashKey?: string
): Promise<BlogPostData> {
  try {
    const systemPrompt = `You are an expert SEO content writer creating humanized, engaging blog posts that readers LOVE and search engines RANK.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.services}
- Service Areas: ${businessContext.serviceAreas || businessContext.heroLocation}
- Primary Keyword: "${keyword}"

HUMANIZED WRITING REQUIREMENTS:

**Writing Style:**
- Write like you're talking to a friend over coffee
- Use "you" and "we" throughout (second person)
- Short, punchy sentences (15-20 words average)
- Short paragraphs (2-4 sentences max)
- Active voice, never passive
- Tell stories and share real examples
- Show personality and emotion
- Simple language (grade 8-9 reading level)
- Use contractions (it's, you're, we'll)

**Content Structure (1500-1800 words):**
- Hook intro with relatable problem
- 5-7 main sections with H2 headings
- Subsections with H3 where needed
- Bullet points and numbered lists
- Real examples with specific details
- FAQ section (3-5 questions)
- Strong conclusion with clear next step

**SEO Optimization:**
- Primary keyword: "${keyword}"
- Use in: title, first 100 words, H2s (naturally), throughout content
- LSI/semantic keywords: include variations and related terms
- Location keywords: ${businessContext.heroLocation} + service combinations
- Natural keyword density (1-2%)
- Answer search intent completely

**Content Quality:**
- Solve a specific problem
- Include actionable tips readers can use
- Add numbers, data, timeframes
- Address objections and concerns
- Build trust through expertise
- Engage emotions
- Make it scannable

Return the response as a JSON object with the exact structure requested.`;

    const userPrompt = `${aiPrompt}

Create a comprehensive, in-depth blog post about: "${keyword}"

CONTENT REQUIREMENTS:
1. **Word Count**: 1500-2000 words minimum
2. **Structure**: Use proper markdown headings (##, ###, ####)
3. **Semantic Keywords**: Include variations like "${keyword} services", "${keyword} cost", "${keyword} process", "${keyword} tips", "professional ${keyword}", "local ${keyword}", "${keyword} in ${businessContext.heroLocation}"
4. **FAQ Section**: Include 5-8 frequently asked questions with detailed answers
5. **Local Focus**: Reference the business location and service areas naturally
6. **Expert Insights**: Provide professional tips, industry knowledge, and best practices
7. **Call-to-Action**: Subtly encourage readers to contact the business

CONTENT SECTIONS TO INCLUDE:
- Introduction with keyword and location
- Main topic explanation (300-400 words)
- Benefits and importance (250-300 words)
- Process or methodology (300-400 words)
- Common issues and solutions (250-300 words)
- Cost factors and considerations (200-250 words)
- When to hire professionals (150-200 words)
- Comprehensive FAQ section (300-400 words)
- Conclusion with local reference

Return a JSON object with these exact fields:
{
  "title": "Compelling, keyword-rich title under 60 characters",
  "slug": "seo-friendly-url-slug",
  "excerpt": "Engaging 150-160 character summary that includes the keyword",
  "content": "Complete 1500-2000 word blog post in Markdown format with ## Main headings, ### Subheadings, and #### Sub-subheadings. Include semantic keywords naturally. Add comprehensive FAQ section. NO image tags or placeholders.",
  "metaTitle": "SEO-optimized title tag under 60 characters with keyword and location",
  "metaDescription": "Meta description 150-160 characters with keyword, location, and value proposition",
  "tags": ["primary-keyword", "semantic-variations", "location-based", "service-related"],
  "category": "Most relevant category for this content",
  "keywords": "${keyword}",
  "aiPrompt": "${aiPrompt}"
}`;

    const response = await getOpenAIClient(customApiKey).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 5000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
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

    // Add featured image from Unsplash with category relevance
    try {
      const featuredImage = await fetchUnsplashImage(keyword, unsplashKey, businessContext.category);
      if (featuredImage) {
        blogPostWithId.featuredImage = featuredImage.url;
        blogPostWithId.featuredImageAlt = featuredImage.alt;
      } else {
        // Use relevant Unsplash image as fallback based on category
        const categoryFallbacks: Record<string, string> = {
          'hvac': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&auto=format',
          'plumbing': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
          'electrical': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
          'roofing': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop&auto=format',
          'solar': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop&auto=format'
        };
        const categoryKey = businessContext.category?.toLowerCase() || '';
        const fallbackKey = Object.keys(categoryFallbacks).find(key => categoryKey.includes(key));
        blogPostWithId.featuredImage = fallbackKey ? categoryFallbacks[fallbackKey] :
          `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format`;
        blogPostWithId.featuredImageAlt = `${businessContext.category} - ${keyword}`;
      }
    } catch (imageError) {
      console.warn("Failed to fetch featured image, using fallback:", imageError);
      // Use category-specific fallback image
      const categoryFallbacks: Record<string, string> = {
        'hvac': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&auto=format',
        'plumbing': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
        'electrical': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
        'roofing': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop&auto=format',
        'solar': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop&auto=format'
      };
      const categoryKey = businessContext.category?.toLowerCase() || '';
      const fallbackKey = Object.keys(categoryFallbacks).find(key => categoryKey.includes(key));
      blogPostWithId.featuredImage = fallbackKey ? categoryFallbacks[fallbackKey] :
        `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format`;
      blogPostWithId.featuredImageAlt = `${businessContext.category} - ${keyword}`;
    }

    return blogPostWithId;
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateMultipleBlogPosts(
  keywords: string[],
  aiPrompt: string,
  businessContext: any,
  customApiKey?: string,
  wordCount: number = 1500,
  unsplashKey?: string
): Promise<BlogPostData[]> {
  const blogPosts: BlogPostData[] = [];

  for (const keyword of keywords) {
    try {
      // Pass word count to the prompt
      const modifiedPrompt = aiPrompt.replace(/\$\{wordCount\}/g, wordCount.toString());
      const blogPost = await generateBlogPost(keyword.trim(), modifiedPrompt, businessContext, customApiKey, unsplashKey);
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

export async function fetchUnsplashImage(keyword: string, customAccessKey?: string, businessCategory?: string): Promise<UnsplashImage | null> {
  try {
    const accessKey = customAccessKey || process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn("Unsplash access key not configured");
      return null;
    }

    // Create category-enhanced search terms for better relevance
    const searchTerms = generateCategoryRelevantSearchTerms(keyword, businessCategory);

    // Try each search term until we find good results
    for (const searchTerm of searchTerms) {
      const searchQuery = encodeURIComponent(searchTerm);
      const randomPage = Math.floor(Math.random() * 2) + 1; // Random page 1-2 for better quality

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=20&page=${randomPage}&orientation=landscape&order_by=relevance`,
          {
            headers: {
              'Authorization': `Client-ID ${accessKey}`
            }
          }
        );

        if (!response.ok) {
          console.warn(`Unsplash API error for "${searchTerm}": ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          // Pick the most relevant image (first result) or random from top 5 for quality
          const topResults = data.results.slice(0, Math.min(5, data.results.length));
          const randomIndex = Math.floor(Math.random() * topResults.length);
          const photo = topResults[randomIndex];

          return {
            url: photo.urls.regular,
            alt: photo.alt_description || `${businessCategory} - ${keyword}`,
            credit: `Photo by ${photo.user.name} on Unsplash`,
            downloadUrl: photo.links.download_location
          };
        }
      } catch (searchError) {
        console.warn(`Error searching for "${searchTerm}":`, searchError);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return null;
  }
}

function generateCategoryRelevantSearchTerms(keyword: string, businessCategory?: string): string[] {
  const cleanKeyword = keyword.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const terms: string[] = [];

  // Business category mappings for better image relevance
  const categoryMappings: Record<string, string[]> = {
    'hvac': ['heating', 'cooling', 'air conditioning', 'furnace', 'thermostat'],
    'ac repair': ['air conditioning', 'hvac', 'cooling system', 'ac unit'],
    'plumbing': ['plumber', 'pipes', 'water', 'bathroom', 'kitchen', 'fixtures'],
    'electrical': ['electrician', 'wiring', 'lighting', 'electrical work', 'power'],
    'roofing': ['roof', 'roofing contractor', 'home exterior', 'construction'],
    'landscaping': ['garden', 'lawn', 'outdoor', 'plants', 'yard work'],
    'pest control': ['home maintenance', 'professional service', 'home inspection'],
    'cleaning': ['house cleaning', 'home maintenance', 'professional cleaning'],
    'moving': ['moving truck', 'relocation', 'home', 'transportation'],
    'insurance': ['professional service', 'business meeting', 'consultation'],
    'solar': ['solar panels', 'renewable energy', 'roof installation', 'green energy'],
    'bathroom': ['bathroom renovation', 'home improvement', 'modern bathroom'],
    'kitchen': ['kitchen renovation', 'home improvement', 'modern kitchen'],
    'flooring': ['home renovation', 'interior design', 'construction'],
    'painting': ['home improvement', 'house painting', 'interior design'],
    'windows': ['home improvement', 'window installation', 'house exterior'],
    'concrete': ['construction', 'driveway', 'concrete work', 'home improvement']
  };

  // Find relevant category terms
  const categoryTerms = businessCategory ?
    categoryMappings[businessCategory.toLowerCase()] ||
    categoryMappings[Object.keys(categoryMappings).find(key => businessCategory.toLowerCase().includes(key)) || ''] ||
    [businessCategory.toLowerCase()]
    : [];

  // Priority search terms (most specific first)
  if (categoryTerms.length > 0) {
    // 1. Category + keyword combination
    terms.push(`${categoryTerms[0]} ${cleanKeyword}`);

    // 2. Professional service context
    terms.push(`professional ${categoryTerms[0]} service`);

    // 3. Multiple category terms with keyword
    categoryTerms.slice(0, 3).forEach(term => {
      terms.push(`${term} ${cleanKeyword}`);
    });
  }

  // 4. Original keyword
  terms.push(cleanKeyword);

  // 5. Professional service fallback
  terms.push(`professional service work`);

  // 6. Home improvement fallback
  terms.push(`home improvement professional`);

  // Remove duplicates and empty terms
  const uniqueTerms = new Set(terms.filter(term => term.trim().length > 0));
  return Array.from(uniqueTerms);
}

// Generate SEO content sections for a business
export async function generateSEOContent(
  businessContext: any,
  customApiKey?: string
): Promise<SEOContentData> {
  try {
    const client = getOpenAIClient(customApiKey);

    const systemPrompt = `You are an expert SEO content writer specializing in humanized, conversion-focused content for local businesses.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.heroService}
- Service Areas: ${businessContext.serviceAreas || businessContext.heroLocation}

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

    const response = await client.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate 6 SEO content sections for ${businessContext.businessName}, a ${businessContext.category} business in ${businessContext.heroLocation}. Focus on local SEO optimization and customer trust factors.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content) as SEOContentData;
  } catch (error) {
    console.error("Error generating SEO content:", error);
    throw new Error(`Failed to generate SEO content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate FAQ content for a business
export async function generateFAQContent(
  businessContext: any,
  customApiKey?: string
): Promise<FAQData> {
  try {
    const client = getOpenAIClient(customApiKey);

    const systemPrompt = `You are a customer service expert creating helpful, humanized FAQ content that sounds like real conversations.

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.heroService}
- Phone: ${businessContext.phone}

HUMANIZED FAQ REQUIREMENTS:

**Questions:**
- Sound like real customer questions (natural language)
- Include location references: ${businessContext.heroLocation}
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

    const response = await client.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate 10 FAQ questions and answers for ${businessContext.businessName}, a ${businessContext.category} business in ${businessContext.heroLocation}. Focus on common customer concerns and local service details.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content) as FAQData;
  } catch (error) {
    console.error("Error generating FAQ content:", error);
    throw new Error(`Failed to generate FAQ content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate testimonials for a business
export async function generateTestimonials(
  businessContext: any,
  customApiKey?: string
): Promise<TestimonialsData> {
  try {
    const client = getOpenAIClient(customApiKey);

    const systemPrompt = `Create 3 authentic, humanized customer testimonials that sound like real people sharing genuine experiences (not marketing copy).

Business Context:
- Business Name: ${businessContext.businessName}
- Category: ${businessContext.category}
- Location: ${businessContext.heroLocation}
- Services: ${businessContext.heroService}

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
- Occasionally reference location: ${businessContext.heroLocation}
- Use semantic keywords naturally
- All 5-star ratings

**3 Different Angles:**
1. Quality/Results - specific outcome they achieved
2. Experience/Service - how they were treated, the process
3. Value/Recommendation - why others should choose this business

Create realistic, diverse customer names.

Return JSON: testimonial1Name, testimonial1Text, testimonial1Rating (5), testimonial2Name, testimonial2Text, testimonial2Rating (5), testimonial3Name, testimonial3Text, testimonial3Rating (5)`;

    const response = await client.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate 3 realistic customer testimonials for ${businessContext.businessName}, a ${businessContext.category} business in ${businessContext.heroLocation}. Make them sound authentic and specific to the service type.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    const parsed = JSON.parse(content) as TestimonialsData;

    // Ensure all ratings are 5
    parsed.testimonial1Rating = 5;
    parsed.testimonial2Rating = 5;
    parsed.testimonial3Rating = 5;

    return parsed;
  } catch (error) {
    console.error("Error generating testimonials:", error);
    throw new Error(`Failed to generate testimonials: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate AI content for service-specific pages
export async function generateServicePageContent(
  serviceName: string,
  businessContext: any,
  customApiKey?: string
): Promise<ServicePageContentData> {
  try {
    const client = getOpenAIClient(customApiKey);

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

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate comprehensive content for a ${serviceName} service page for ${businessContext.businessName}, a ${businessContext.category} business in ${businessContext.heroLocation}. Focus on local expertise and customer benefits.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content) as ServicePageContentData;
  } catch (error) {
    console.error("Error generating service page content:", error);
    throw new Error(`Failed to generate service page content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate AI content for location-specific pages
export async function generateLocationPageContent(
  locationName: string,
  businessContext: any,
  customApiKey?: string
): Promise<LocationPageContentData> {
  try {
    const client = getOpenAIClient(customApiKey);

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

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate comprehensive location-specific content for ${locationName} for ${businessContext.businessName}, a ${businessContext.category} business serving ${locationName} from ${businessContext.heroLocation}. Focus on local expertise and community connection.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content) as LocationPageContentData;
  } catch (error) {
    console.error("Error generating location page content:", error);
    throw new Error(`Failed to generate location page content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}