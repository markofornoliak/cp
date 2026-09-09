import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { AlertTriangle } from 'lucide-react';

export function Settings() {
  const { progress, reset } = useProgress();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    reset();
    setShowConfirm(false);
  };

  return (
    <div className="page page-reading">
      <div className="stack stack-8">
        <div className="stack stack-3">
          <h1 className="h2">Settings</h1>
          <p className="text-secondary">Manage your local learning data. Everything is stored in your browser.</p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Storage</h3>
          <div className="stack stack-3">
            <div className="row row-between">
              <span className="text-small text-secondary">Lessons completed</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{progress.completedLessons.length}</span>
            </div>
            <div className="row row-between">
              <span className="text-small text-secondary">Exercises solved</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{progress.completedExercises.length}</span>
            </div>
            <div className="row row-between">
              <span className="text-small text-secondary">Projects completed</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{progress.completedProjects.length}</span>
            </div>
            <div className="row row-between">
              <span className="text-small text-secondary">Last active</span>
              <span className="text-small">{new Date(progress.lastActiveAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 22, borderColor: 'var(--error-border)', background: 'var(--error-subtle)' }}>
          <div className="stack stack-4">
            <div className="row row-2" style={{ color: 'var(--error)', fontWeight: 600 }}>
              <AlertTriangle size={18} />
              Reset learning progress
            </div>
            <p className="text-small" style={{ color: '#991b1b', lineHeight: 1.5 }}>
              This will permanently delete all completed lessons, exercises, and projects stored locally. This cannot be undone.
            </p>
            {!showConfirm ? (
              <button className="btn btn-secondary" style={{ borderColor: 'var(--error-border)', color: 'var(--error)', background: 'white' }} onClick={() => setShowConfirm(true)}>
                Reset progress
              </button>
            ) : (
              <div className="stack stack-3">
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--error)' }}>Are you sure? This will erase everything.</p>
                <div className="row row-3">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="btn" style={{ background: 'var(--error)', color: 'white' }} onClick={handleReset}>Yes, reset</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>About execution</h3>
          <p className="text-small text-secondary" style={{ lineHeight: 1.6 }}>
            Code runs via Piston API (emkc.org), a public code execution service. No API key is required, requests are isolated, and no credentials are exposed. If the service is unavailable, you’ll see a clear error and can retry. The execution layer is abstracted behind CodeExecutionService so it can be replaced with a WebAssembly toolchain later.
          </p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Deployment</h3>
          <p className="text-small text-secondary" style={{ lineHeight: 1.6 }}>
            This app is built for GitHub Pages with base path /Cpp/. Routing uses HashRouter to avoid 404s on refresh. Progress persists via localStorage versioned as learn-cpp-progress-v1.
          </p>
        </div>
      </div>
    </div>
  );
}
