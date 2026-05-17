const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    for (const r of replacements) {
        if (typeof r.search === 'string') {
            content = content.replace(r.search, r.replace);
        } else {
            content = content.replace(r.search, r.replace);
        }
    }
    
    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Patched ${filePath}`);
    }
}

// 1. admin-settings.tsx
replaceInFile('client/src/pages/admin-settings.tsx', [
    { search: '<option value="OpenRouter">OpenRouter</option>', replace: '<option value="OpenRouter">OpenRouter</option><option value="DeepSeek">DeepSeek</option>' }
]);

// 2. ai-auto-generate-modal.tsx
replaceInFile('client/src/components/ai-auto-generate-modal.tsx', [
    { search: 'type AIProvider = "openai" | "gemini" | "openrouter";', replace: 'type AIProvider = "openai" | "gemini" | "openrouter" | "deepseek";' },
    { search: 'const { data: openrouterSetting } = useQuery({', replace: 'const { data: openrouterSetting } = useQuery({ queryKey: ["/api/settings/openrouter"] });\n  const { data: deepseekSetting } = useQuery({' },
    { search: 'queryKey: ["/api/settings/openrouter"],', replace: 'queryKey: ["/api/settings/deepseek"],' },
    { search: 'const hasOpenRouter = ((openrouterSetting as any)?.apiKey && (openrouterSetting as any)?.isActive) ||\n    !!sessionStorage.getItem(\'guest_openrouter_key\');', replace: 'const hasOpenRouter = ((openrouterSetting as any)?.apiKey && (openrouterSetting as any)?.isActive) || !!sessionStorage.getItem(\'guest_openrouter_key\');\n  const hasDeepSeek = ((deepseekSetting as any)?.apiKey && (deepseekSetting as any)?.isActive) || !!sessionStorage.getItem(\'guest_deepseek_key\');' },
    { search: 'const hasAnyAI = hasOpenAI || hasGemini || hasOpenRouter;', replace: 'const hasAnyAI = hasOpenAI || hasGemini || hasOpenRouter || hasDeepSeek;' },
    { search: '...(hasOpenRouter ? ["openrouter" as const] : []),', replace: '...(hasOpenRouter ? ["openrouter" as const] : []),\n    ...(hasDeepSeek ? ["deepseek" as const] : []),' },
    { search: '<SelectItem value="openrouter" disabled={!hasOpenRouter}>\n                      <span>OpenRouter</span>\n                      {hasOpenRouter ? (\n                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded ml-2">Ready</span>\n                      ) : (\n                        <span className="text-[10px] bg-zinc-500/10 text-zinc-400 px-1.5 py-0.5 rounded ml-2">Missing Key</span>\n                      )}\n                    </SelectItem>', replace: '<SelectItem value="openrouter" disabled={!hasOpenRouter}>\n                      <span>OpenRouter</span>\n                      {hasOpenRouter ? (\n                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded ml-2">Ready</span>\n                      ) : (\n                        <span className="text-[10px] bg-zinc-500/10 text-zinc-400 px-1.5 py-0.5 rounded ml-2">Missing Key</span>\n                      )}\n                    </SelectItem>\n                    <SelectItem value="deepseek" disabled={!hasDeepSeek}>\n                      <span>DeepSeek</span>\n                      {hasDeepSeek ? (\n                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded ml-2">Ready</span>\n                      ) : (\n                        <span className="text-[10px] bg-zinc-500/10 text-zinc-400 px-1.5 py-0.5 rounded ml-2">Missing Key</span>\n                      )}\n                    </SelectItem>' }
]);

// 3. api-setup.tsx
replaceInFile('client/src/pages/api-setup.tsx', [
    { search: 'type Provider = "openai" | "gemini" | "openrouter" | "netlify" | "unsplash";', replace: 'type Provider = "openai" | "gemini" | "openrouter" | "deepseek" | "netlify" | "unsplash";' },
    { search: '{ id: "openrouter", name: "OpenRouter", desc: "100+ models via single key", docsUrl: "https://openrouter.ai/settings/keys" },', replace: '{ id: "openrouter", name: "OpenRouter", desc: "100+ models via single key", docsUrl: "https://openrouter.ai/settings/keys" },\n  { id: "deepseek", name: "DeepSeek", desc: "Affordable AI", docsUrl: "https://platform.deepseek.com/api_keys" },' },
    { search: 'openrouter: "",', replace: 'openrouter: "",\n  deepseek: "",' },
    { search: 'openrouter: null,', replace: 'openrouter: null,\n    deepseek: null,' },
    { search: 'openrouter: false,', replace: 'openrouter: false,\n    deepseek: false,' },
    { search: 'const { data: openrouterSetting } = useQuery({ queryKey: ["/api/settings/openrouter"], enabled: true });', replace: 'const { data: openrouterSetting } = useQuery({ queryKey: ["/api/settings/openrouter"], enabled: true });\n  const { data: deepseekSetting } = useQuery({ queryKey: ["/api/settings/deepseek"], enabled: true });' },
    { search: 'openrouter: openrouterSetting as ApiSetting | undefined,', replace: 'openrouter: openrouterSetting as ApiSetting | undefined,\n      deepseek: deepseekSetting as ApiSetting | undefined,' },
    { search: 'case "openrouter":\n          testResult = await testViaEndpoint("/api/test-openrouter", { apiKey }, "OpenRouter API connection successful");\n          break;', replace: 'case "openrouter":\n          testResult = await testViaEndpoint("/api/test-openrouter", { apiKey }, "OpenRouter API connection successful");\n          break;\n        case "deepseek":\n          testResult = await testViaEndpoint("/api/test-deepseek", { apiKey }, "DeepSeek API connection successful");\n          break;' }
]);

// 4. api-field-config.tsx
replaceInFile('client/src/components/api-field-config.tsx', [
    { search: 'case "openrouter":\n      return {\n        placeholder: "Enter OpenRouter API key",\n        docsUrl: "https://openrouter.ai/keys",\n        helpText: "Get your key from OpenRouter Settings"\n      };', replace: 'case "openrouter":\n      return {\n        placeholder: "Enter OpenRouter API key",\n        docsUrl: "https://openrouter.ai/keys",\n        helpText: "Get your key from OpenRouter Settings"\n      };\n    case "deepseek":\n      return {\n        placeholder: "Enter DeepSeek API key",\n        docsUrl: "https://platform.deepseek.com/api_keys",\n        helpText: "Get your key from DeepSeek Dashboard"\n      };' }
]);

// 5. api-key-input.tsx
replaceInFile('client/src/components/api-key-input.tsx', [
    { search: 'type Provider = "openai" | "openrouter" | "gemini" | "netlify" | "unsplash";', replace: 'type Provider = "openai" | "openrouter" | "gemini" | "deepseek" | "netlify" | "unsplash";' },
    { search: 'openrouter: {\n    name: "OpenRouter",\n    icon: <Globe className="h-4 w-4 text-purple-500" />,\n    docsUrl: "https://openrouter.ai/settings/keys",\n    helpText: "Get an API key from OpenRouter"\n  },', replace: 'openrouter: {\n    name: "OpenRouter",\n    icon: <Globe className="h-4 w-4 text-purple-500" />,\n    docsUrl: "https://openrouter.ai/settings/keys",\n    helpText: "Get an API key from OpenRouter"\n  },\n  deepseek: {\n    name: "DeepSeek",\n    icon: <Globe className="h-4 w-4 text-indigo-500" />,\n    docsUrl: "https://platform.deepseek.com/api_keys",\n    helpText: "Get an API key from DeepSeek"\n  },' },
    { search: 'openrouter: "",', replace: 'openrouter: "",\n    deepseek: "",' },
    { search: 'openrouter: false,', replace: 'openrouter: false,\n    deepseek: false,' },
    { search: '<TabsTrigger value="openrouter" className="text-xs">\n              OpenRouter\n            </TabsTrigger>', replace: '<TabsTrigger value="openrouter" className="text-xs">\n              OpenRouter\n            </TabsTrigger>\n            <TabsTrigger value="deepseek" className="text-xs">\n              DeepSeek\n            </TabsTrigger>' }
]);

// 6. blog-generation-interface.tsx
replaceInFile('client/src/components/blog-generation-interface.tsx', [
    { search: '<SelectItem value="openrouter">OpenRouter</SelectItem>', replace: '<SelectItem value="openrouter">OpenRouter</SelectItem>\n                      <SelectItem value="deepseek">DeepSeek</SelectItem>' }
]);

// 7. blog-generator-section.tsx
replaceInFile('client/src/components/blog-generator-section.tsx', [
    { search: 'const openrouterSetting = apiSettings?.find(s => s.name === \'openrouter\' && s.isActive && s.apiKey);', replace: 'const openrouterSetting = apiSettings?.find(s => s.name === \'openrouter\' && s.isActive && s.apiKey);\n  const deepseekSetting = apiSettings?.find(s => s.name === \'deepseek\' && s.isActive && s.apiKey);' },
    { search: 'const hasValidAI = openaiSetting || geminiSetting || openrouterSetting;', replace: 'const hasValidAI = openaiSetting || geminiSetting || openrouterSetting || deepseekSetting;' },
    { search: 'if (openrouterSetting) return \'openrouter\';', replace: 'if (openrouterSetting) return \'openrouter\';\n    if (deepseekSetting) return \'deepseek\';' },
    { search: '{openrouterSetting && <span className="block text-sm">• OpenRouter available</span>}', replace: '{openrouterSetting && <span className="block text-sm">• OpenRouter available</span>}\n              {deepseekSetting && <span className="block text-sm">• DeepSeek available</span>}' }
]);

// 8. dashboard-website-editor.tsx
replaceInFile('client/src/pages/dashboard-website-editor.tsx', [
    { search: 'type AIProvider = "openai" | "gemini" | "openrouter";', replace: 'type AIProvider = "openai" | "gemini" | "openrouter" | "deepseek";' },
    { search: 'value === "openai" || value === "gemini" || value === "openrouter";', replace: 'value === "openai" || value === "gemini" || value === "openrouter" || value === "deepseek";' },
    { search: '<option value="openrouter">OpenRouter</option>', replace: '<option value="openrouter">OpenRouter</option>\n                                                    <option value="deepseek">DeepSeek</option>' }
]);

// 9. onboarding-api-setup.tsx
replaceInFile('client/src/pages/onboarding-api-setup.tsx', [
    { search: '{ id: "openrouter", name: "OpenRouter", desc: "100+ models via single key", docsUrl: "https://openrouter.ai/keys" },', replace: '{ id: "openrouter", name: "OpenRouter", desc: "100+ models via single key", docsUrl: "https://openrouter.ai/keys" },\n    { id: "deepseek", name: "DeepSeek", desc: "Affordable AI", docsUrl: "https://platform.deepseek.com/api_keys" },' }
]);

// 10. step-blog.tsx
replaceInFile('client/src/components/steps/step-blog.tsx', [
    { search: '<SelectItem value="openrouter">OpenRouter</SelectItem>', replace: '<SelectItem value="openrouter">OpenRouter</SelectItem>\n                              <SelectItem value="deepseek">DeepSeek</SelectItem>' }
]);

// 11. wd-site-editor.tsx
replaceInFile('client/src/pages/wd-site-editor.tsx', [
    { search: 'type AIProvider = "openai" | "gemini" | "openrouter";', replace: 'type AIProvider = "openai" | "gemini" | "openrouter" | "deepseek";' },
    { search: 'value === "openai" || value === "gemini" || value === "openrouter";', replace: 'value === "openai" || value === "gemini" || value === "openrouter" || value === "deepseek";' },
    { search: '<option value="openrouter">OpenRouter</option>', replace: '<option value="openrouter">OpenRouter</option>\n            <option value="deepseek">DeepSeek</option>' },
    { search: 'fetch("/api/settings/openrouter", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),', replace: 'fetch("/api/settings/openrouter", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),\n        fetch("/api/settings/deepseek", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),' },
    { search: ']).then(([openai, gemini, openrouter]) => {', replace: ']).then(([openai, gemini, openrouter, deepseek]) => {' },
    { search: 'const hasKey = (openai?.apiKey) || (gemini?.apiKey) || (openrouter?.apiKey) || bd.openaiApiKey || bd.geminiApiKey;', replace: 'const hasKey = (openai?.apiKey) || (gemini?.apiKey) || (openrouter?.apiKey) || (deepseek?.apiKey) || bd.openaiApiKey || bd.geminiApiKey || bd.deepseekApiKey;' }
]);

console.log("Finished patching client UI");
