import { useState, useCallback } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { highlightCode, getLanguageLabel } from '../../lib/syntaxHighlighter';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
  showPreview?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  height = "400px",
  className,
  showPreview = true,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleInsertMarkdown = useCallback((markdown: string) => {
    const textarea = document.querySelector('.markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const after = text.substring(end);
    const newValue = before + markdown + after;

    onChange(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markdown.length, start + markdown.length);
    }, 0);
  }, [onChange]);

  const toolbarButtons = [
    {
      icon: '**B**',
      title: 'Bold',
      action: () => handleInsertMarkdown('**bold text**')
    },
    {
      icon: '*I*',
      title: 'Italic',
      action: () => handleInsertMarkdown('*italic text*')
    },
    {
      icon: '#',
      title: 'Heading',
      action: () => handleInsertMarkdown('# Heading')
    },
    {
      icon: '[]',
      title: 'Link',
      action: () => handleInsertMarkdown('[link text](url)')
    },
    {
      icon: '<>',
      title: 'Code',
      action: () => handleInsertMarkdown('`code`')
    },
    {
      icon: '```',
      title: 'Code Block',
      action: () => handleInsertMarkdown('\n```javascript\ncode block\n```\n')
    },
    {
      icon: '•',
      title: 'List',
      action: () => handleInsertMarkdown('\n- List item\n')
    },
    {
      icon: '1.',
      title: 'Numbered List',
      action: () => handleInsertMarkdown('\n1. List item\n')
    },
    {
      icon: '>',
      title: 'Quote',
      action: () => handleInsertMarkdown('\n> Quote\n')
    },
  ];

  return (
    <div className={cn(
      'border border-border rounded-lg overflow-hidden bg-background',
      isFullscreen && 'fixed inset-4 z-50 shadow-large',
      className
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="small"
              onClick={button.action}
              title={button.title}
              className="h-8 w-8 p-0 text-xs font-mono"
            >
              {button.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {showPreview && (
            <div className="flex rounded-lg border border-border">
              <Button
                variant={activeTab === 'write' ? 'secondary' : 'ghost'}
                size="small"
                onClick={() => setActiveTab('write')}
                className="rounded-r-none"
              >
                Write
              </Button>
              <Button
                variant={activeTab === 'preview' ? 'secondary' : 'ghost'}
                size="small"
                onClick={() => setActiveTab('preview')}
                className="rounded-l-none"
              >
                Preview
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="small"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '⊗' : '⊞'}
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div style={{ height }}>
        {activeTab === 'write' ? (
          <textarea
            className={cn(
              'markdown-textarea w-full h-full p-4 resize-none',
              'bg-background text-foreground placeholder-muted-foreground',
              'border-0 outline-none font-mono text-sm leading-relaxed'
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <div className="h-full overflow-auto">
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground bg-muted border-t border-border">
        <div className="flex items-center gap-4">
          <span>{value.length} characters</span>
          <span>{value.split(/\s+/).filter(Boolean).length} words</span>
          <span>{value.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
}

// Simple Markdown Preview Component
function MarkdownPreview({ content }: { content: string }) {
  // Basic markdown parsing (for more advanced features, consider using a library like react-markdown)
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-foreground mb-3 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-foreground mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mb-4 mt-8">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-200 pl-4 italic text-muted-foreground">$1</blockquote>');

    // Code blocks with syntax highlighting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, language, code) => {
      const lang = language || 'text';
      const highlightedCode = highlightCode(code.trim(), lang);
      const langLabel = getLanguageLabel(lang);
      return `<div class="relative my-4">
        <div class="flex items-center justify-between bg-muted px-4 py-2 border-b border-border rounded-t-lg">
          <span class="text-xs font-medium text-muted-foreground">${langLabel}</span>
          <button
            class="text-xs text-muted-foreground hover:text-foreground"
            onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)"
            title="Copy code"
          >
            Copy
          </button>
        </div>
        <pre class="bg-muted p-4 rounded-b-lg overflow-x-auto"><code class="text-sm font-mono">${highlightedCode}</code></pre>
      </div>`;
    });

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  };

  if (!content.trim()) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <p>Nothing to preview yet</p>
          <p className="text-sm">Start writing in the editor to see a preview</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none p-4 text-foreground"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}