import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface Props {
  code: string;
  caption?: string;
  language?: string;
}

export function CodeBlock({ code, caption }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{caption || 'C++'}</span>
        <button onClick={copy} className="btn btn-ghost btn-sm" style={{ color: '#94a3b8', height: 28 }} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="code-block-content">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}
