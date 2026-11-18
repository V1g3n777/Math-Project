import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  copyable?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  copyable = false,
}) => {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
      return `<span class="text-rose-500 font-mono text-xs">${math}</span>`;
    }
  }, [math, block]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(math);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (copyable) {
    return (
      <div className={`group relative inline-flex items-center gap-2 ${block ? 'my-2 block' : 'inline-block'} ${className}`}>
        <span
          className="overflow-x-auto text-slate-900 dark:text-slate-100 py-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <button
          onClick={handleCopy}
          title="Copy LaTeX formula"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <span
      className={`overflow-x-auto ${block ? 'my-2 block text-center' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
