// Enhanced blog content formatting utilities

export function formatMarkdownToHtml(content: string): string {
  if (!content) return '';
  
  return content
    // Headers (h1-h4)
    .replace(/^#### (.*$)/gm, '<h4 class="text-xl font-semibold mt-4 mb-2 text-gray-700">$1</h4>')
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-800">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-8 mb-6 text-gray-900 border-b-3 border-blue-600 pb-3">$1</h1>')
    
    // Text formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
    
    // Code blocks and inline code
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    
    // Lists
    .replace(/^\* (.*$)/gm, '<li class="ml-6 mb-2 relative"><span class="absolute -left-4 text-blue-500 font-bold">•</span>$1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2 relative"><span class="absolute -left-4 text-blue-500 font-bold">•</span>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 mb-2 list-decimal">$2</li>')
    
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-6 py-3 my-4 bg-blue-50 italic text-gray-700 rounded-r-lg">$1</blockquote>')
    
    // Links and images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="w-full max-w-2xl rounded-lg my-6 shadow-lg mx-auto block">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">$1</a>')
    
    // Paragraphs and line breaks
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-700">')
    .replace(/\n/g, '<br>');
}

export function formatContentForWebsite(content: string): string {
  if (!content) return '';
  
  // More aggressive formatting for website generation
  return content
    // Headers with proper semantic structure
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Text formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    
    // Code
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Lists - wrap in ul/ol tags
    .replace(/(?:^\* .*$\n?)+/gm, (match) => {
      const items = match.trim().split('\n').map(line => 
        line.replace(/^\* (.*)$/, '<li>$1</li>')
      ).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/(?:^- .*$\n?)+/gm, (match) => {
      const items = match.trim().split('\n').map(line => 
        line.replace(/^- (.*)$/, '<li>$1</li>')
      ).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/(?:^\d+\. .*$\n?)+/gm, (match) => {
      const items = match.trim().split('\n').map(line => 
        line.replace(/^\d+\. (.*)$/, '<li>$1</li>')
      ).join('');
      return `<ol>${items}</ol>`;
    })
    
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    
    // Links and images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

export function extractPlainText(content: string): string {
  if (!content) return '';
  
  return content
    // Remove Markdown formatting
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/^[>*-]\s/gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = extractPlainText(content);
  if (plainText.length <= maxLength) return plainText;
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}