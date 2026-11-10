import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

/** Copies text to the clipboard and confirms with a brief "Copied" state. */
export function CopyButton({ value, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers: fall back to a temporary textarea
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
      } catch {
        area.remove();
        return;
      }
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[0.8125rem] font-semibold text-brand transition-colors hover:bg-brand/10 ${className}`}
    >
      {copied ? <Check className="h-4 w-4 text-[#1a7f45]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
