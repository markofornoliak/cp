import { lazy, Suspense } from 'react';

const MonacoEditorLazy = lazy(() => import('@monaco-editor/react').then(mod => ({ default: mod.default })));

interface Props {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

function Fallback({ height }: { height?: string }) {
  return (
    <div
      style={{
        height: height || '420px',
        background: '#0f1720',
        borderRadius: '12px',
        display: 'grid',
        placeItems: 'center',
        color: '#64748b',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '13px',
      }}
    >
      Loading editor...
    </div>
  );
}

export function CodeEditor({ value, onChange, language = 'cpp', height = '420px' }: Props) {
  return (
    <Suspense fallback={<Fallback height={height} />}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
        <MonacoEditorLazy
          height={height}
          language={language}
          value={value}
          onChange={(v) => onChange(v || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 4,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            suggest: { showKeywords: true },
            quickSuggestions: false,
          }}
        />
      </div>
    </Suspense>
  );
}

// Simple textarea fallback for tests or when monaco fails
export function SimpleEditor({ value, onChange, height = '420px' }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height,
        background: '#0f1720',
        color: '#e2e8f0',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        resize: 'vertical',
      }}
      spellCheck={false}
    />
  );
}
