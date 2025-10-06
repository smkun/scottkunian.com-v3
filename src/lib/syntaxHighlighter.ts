// Lightweight syntax highlighting without external dependencies
// Supports common languages with basic token highlighting

interface HighlightRule {
  pattern: RegExp;
  className: string;
}

const languageRules: Record<string, HighlightRule[]> = {
  javascript: [
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|class|extends|import|export|from|as|static|public|private|protected)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'text-green-600' },
    { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
  ],
  typescript: [
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|class|extends|import|export|from|as|static|public|private|protected|interface|type|enum|namespace|declare|readonly)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\b(string|number|boolean|object|any|void|never|unknown)\b/g, className: 'text-blue-700 font-medium' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'text-green-600' },
    { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
  ],
  jsx: [
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|class|extends|import|export|from|as|static|public|private|protected)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'text-green-600' },
    { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g, className: 'text-red-600' },
    { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
  ],
  tsx: [
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|class|extends|import|export|from|as|static|public|private|protected|interface|type|enum|namespace|declare|readonly)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\b(string|number|boolean|object|any|void|never|unknown)\b/g, className: 'text-blue-700 font-medium' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'text-green-600' },
    { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g, className: 'text-red-600' },
    { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
  ],
  python: [
    { pattern: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|lambda|global|nonlocal|assert|del|raise|and|or|not|in|is)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\b(True|False|None)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'text-green-600' },
    { pattern: /#.*$/gm, className: 'text-gray-500 italic' },
  ],
  css: [
    { pattern: /\b(color|background|margin|padding|border|width|height|display|position|top|left|right|bottom|z-index|opacity|transform|transition|animation|font-family|font-size|font-weight|text-align|flex|grid)\b/g, className: 'text-blue-700' },
    { pattern: /#[a-fA-F0-9]{3,6}\b/g, className: 'text-purple-600' },
    { pattern: /\b\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)\b/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'text-green-600' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
  ],
  html: [
    { pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g, className: 'text-red-600' },
    { pattern: /\b(href|src|alt|title|class|id|style|target|rel|type|charset|content|name|value|placeholder|required|disabled|readonly|checked|selected|multiple|size|maxlength|pattern|autocomplete|autofocus|form|formaction|formmethod|formtarget|formnovalidate|novalidate|spellcheck|translate|dir|lang|tabindex|accesskey|contenteditable|contextmenu|draggable|dropzone|hidden|role|aria-[a-z-]+|data-[a-z-]+)\b/g, className: 'text-blue-700' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'text-green-600' },
    { pattern: /<!--[\s\S]*?-->/g, className: 'text-gray-500 italic' },
  ],
  json: [
    { pattern: /"([^"\\]|\\.)*"(?=\s*:)/g, className: 'text-red-600' },
    { pattern: /"([^"\\]|\\.)*"(?!\s*:)/g, className: 'text-green-600' },
    { pattern: /\b(true|false|null)\b/g, className: 'text-blue-600' },
    { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-blue-600' },
  ],
  bash: [
    { pattern: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue|echo|printf|read|export|alias|unalias|cd|pwd|ls|mkdir|rmdir|rm|cp|mv|chmod|chown|grep|sed|awk|sort|uniq|head|tail|cat|less|more|find|which|whereis|man|sudo|su)\b/g, className: 'text-purple-600 font-medium' },
    { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'text-blue-600' },
    { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'text-green-600' },
    { pattern: /#.*$/gm, className: 'text-gray-500 italic' },
  ]
};

export function highlightCode(code: string, language: string): string {
  const rules = languageRules[language.toLowerCase()] || [];

  if (rules.length === 0) {
    // No highlighting rules for this language, return as-is with basic styling
    return `<span class="text-foreground">${escapeHtml(code)}</span>`;
  }

  let highlightedCode = escapeHtml(code);

  // Apply highlighting rules in order
  rules.forEach(rule => {
    highlightedCode = highlightedCode.replace(rule.pattern, (match) => {
      return `<span class="${rule.className}">${match}</span>`;
    });
  });

  return highlightedCode;
}

export function getLanguageLabel(language: string): string {
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'JSX',
    tsx: 'TSX',
    python: 'Python',
    css: 'CSS',
    html: 'HTML',
    json: 'JSON',
    bash: 'Bash',
    shell: 'Shell',
    sh: 'Shell',
    js: 'JavaScript',
    ts: 'TypeScript',
    py: 'Python'
  };

  return labels[language.toLowerCase()] || language.toUpperCase();
}

export function getSupportedLanguages(): string[] {
  return Object.keys(languageRules);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}