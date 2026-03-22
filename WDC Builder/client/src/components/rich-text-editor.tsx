import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Code, Type } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [editorMode, setEditorMode] = useState<'visual' | 'source'>('visual');

  // Rich text editor configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className={className}>
      <Tabs value={editorMode} onValueChange={(tab) => setEditorMode(tab as 'visual' | 'source')}>
        <div className="border rounded-lg overflow-hidden">
          {/* Editor Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
            <div className="text-sm font-medium text-muted-foreground">
              Content Editor
            </div>
            <TabsList className="h-8">
              <TabsTrigger 
                value="visual" 
                className="h-6 px-3 text-xs"
                data-testid="button-visual-editor"
              >
                <Type className="h-3 w-3 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger 
                value="source" 
                className="h-6 px-3 text-xs"
                data-testid="button-source-editor"
              >
                <Code className="h-3 w-3 mr-1" />
                Source
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="visual" className="p-0 m-0">
            <div className="min-h-[400px]">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || "Write your content here. Use the rich text editor for formatting..."}
                style={{ minHeight: '400px', border: 'none' }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="source" className="p-0 m-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Edit HTML source directly..."}
              className="min-h-[400px] border-0 rounded-none resize-none font-mono text-sm focus:ring-0 focus:ring-offset-0"
              data-testid="textarea-source-editor"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}