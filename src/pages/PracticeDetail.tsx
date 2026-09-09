import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Play, Send, AlertCircle, CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';
import { exercises } from '../content/exercises';
import { CodeEditor } from '../components/MonacoEditor';
import { executionService } from '../services/execution';
import type { ExecutionResult, SubmissionResult } from '../types';
import { useProgress } from '../hooks/useProgress';

export function PracticeDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = useMemo(() => exercises.find(e => e.id === exerciseId), [exerciseId]);
  const { progress, markExerciseComplete } = useProgress();

  const [code, setCode] = useState(() => exercise?.starterCode || '');
  const [stdin, setStdin] = useState(() => exercise?.sampleInput || '');
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');

  useEffect(() => {
    if (exercise) {
      setCode(exercise.starterCode);
      setStdin(exercise.sampleInput || '');
      setExecution(null);
      setSubmission(null);
    }
  }, [exercise]);

  if (!exercise) {
    return (
      <div className="page page-wide">
        <div className="empty-state">
          <h3>Exercise not found</h3>
          <Link to="/practice" className="btn btn-secondary" style={{ marginTop: 16 }}>Back to practice</Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedExercises.includes(exercise.id);

  const handleRun = async () => {
    setIsRunning(true);
    setExecution(null);
    setSubmission(null);
    setActiveTab('output');
    try {
      const result = await executionService.execute(code, stdin);
      setExecution(result);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setExecution(null);
    setSubmission(null);
    setActiveTab('tests');
    try {
      const result = await executionService.submit(code, exercise.testCases);
      setSubmission(result);
      if (result.status === 'accepted') {
        markExerciseComplete(exercise.id, {
          exerciseId: exercise.id,
          status: 'accepted',
          timestamp: Date.now(),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setExecution(null);
    setSubmission(null);
  };

  return (
    <div className="page page-editor">
      <div className="stack stack-6">
        <Link to="/practice" className="row row-2 text-small text-secondary" style={{ width: 'fit-content' }}>
          <ArrowLeft size={16} />
          Back to practice
        </Link>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left: Problem */}
          <div className="stack stack-6">
            <div className="stack stack-3">
              <div className="row row-3">
                <h1 className="h3" style={{ fontSize: 22 }}>{exercise.title}</h1>
                <span className={`badge badge-${exercise.difficulty.toLowerCase()}`}>{exercise.difficulty}</span>
                {isCompleted && <span className="row row-2 text-small" style={{ color: 'var(--success)', fontWeight: 600 }}><CheckCircle2 size={14} />Solved</span>}
              </div>
              <p className="text-secondary">{exercise.description}</p>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="stack stack-4">
                <h3 style={{ fontWeight: 600, fontSize: 14 }}>Task</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{exercise.prompt}</p>

                {exercise.sampleInput !== undefined && (
                  <div className="stack stack-3">
                    <div className="row" style={{ gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-small text-tertiary" style={{ marginBottom: 6, fontWeight: 600 }}>Input</div>
                        <pre style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{exercise.sampleInput || '(empty)'}</pre>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="text-small text-tertiary" style={{ marginBottom: 6, fontWeight: 600 }}>Output</div>
                        <pre style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{exercise.sampleOutput || ''}</pre>
                      </div>
                    </div>
                  </div>
                )}

                {exercise.hints && exercise.hints.length > 0 && (
                  <details style={{ fontSize: 13 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>Hints</summary>
                    <ul style={{ marginTop: 8, paddingLeft: 18, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {exercise.hints.map((h, i) => <li key={i} className="text-secondary">{h}</li>)}
                    </ul>
                  </details>
                )}

                <div className="row row-2" style={{ flexWrap: 'wrap' }}>
                  {exercise.concepts.map(c => (
                    <span key={c} className="badge badge-neutral" style={{ textTransform: 'none', fontWeight: 400 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stdin */}
            <div className="card" style={{ padding: 16 }}>
              <div className="stack stack-3">
                <div className="row row-between">
                  <label style={{ fontWeight: 600, fontSize: 13 }}>Custom Input (stdin)</label>
                  <span className="text-small text-tertiary">Used when you press Run</span>
                </div>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter input for your program..."
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Editor + Results */}
          <div className="stack stack-4">
            <div className="editor-wrapper">
              <div className="editor-toolbar">
                <span style={{ fontSize: 13, fontWeight: 600 }}>main.cpp</span>
                <div className="row row-2">
                  <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              </div>
              <CodeEditor value={code} onChange={setCode} height="440px" />
            </div>

            <div className="row row-3">
              <button className="btn btn-secondary" onClick={handleRun} disabled={isRunning || isSubmitting} style={{ flex: 1 }}>
                {isRunning ? <Clock size={16} className="spin" /> : <Play size={16} />}
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isRunning || isSubmitting} style={{ flex: 1 }}>
                <Send size={16} />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Result Tabs */}
            <div className="result-panel">
              <div className="result-header">
                <div className="row row-3">
                  <button
                    onClick={() => setActiveTab('output')}
                    className={`btn btn-sm ${activeTab === 'output' ? 'btn-secondary' : 'btn-ghost'}`}
                  >
                    Output
                  </button>
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`btn btn-sm ${activeTab === 'tests' ? 'btn-secondary' : 'btn-ghost'}`}
                  >
                    Tests {submission ? `(${submission.passed}/${submission.total})` : ''}
                  </button>
                </div>
                <div className="text-small text-tertiary">
                  {execution?.status === 'success' && <span style={{ color: 'var(--success)' }}>✓ Success</span>}
                  {execution?.status === 'compile_error' && <span style={{ color: 'var(--error)' }}>✗ Compile error</span>}
                  {execution?.status === 'runtime_error' && <span style={{ color: 'var(--error)' }}>✗ Runtime error</span>}
                  {execution?.status === 'timeout' && <span style={{ color: 'var(--warning)' }}>⏱ Timeout</span>}
                  {submission?.status === 'accepted' && <span style={{ color: 'var(--success)' }}>✓ Accepted</span>}
                  {submission?.status === 'wrong_answer' && <span style={{ color: 'var(--error)' }}>✗ Wrong answer</span>}
                </div>
              </div>

              <div className="result-body">
                {activeTab === 'output' && (
                  <>
                    {!execution && !isRunning && <span className="text-tertiary">Run your code to see output here.</span>}
                    {isRunning && <span className="text-secondary">Executing... This may take a few seconds.</span>}
                    {execution && (
                      <div className="stack stack-3">
                        {execution.status === 'compile_error' && (
                          <div className="stack stack-2">
                            <div className="row row-2" style={{ color: 'var(--error)', fontWeight: 600 }}><XCircle size={16} />Compiler error</div>
                            <div style={{ color: 'var(--error)' }}>{execution.errorMessage}</div>
                            {execution.compileOutput && (
                              <details style={{ marginTop: 8 }}>
                                <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>Raw compiler output</summary>
                                <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 12 }}>{execution.compileOutput}</pre>
                              </details>
                            )}
                          </div>
                        )}
                        {execution.status === 'runtime_error' && (
                          <div className="stack stack-2">
                            <div className="row row-2" style={{ color: 'var(--error)', fontWeight: 600 }}><AlertCircle size={16} />Runtime error</div>
                            <div>{execution.errorMessage}</div>
                            {execution.stderr && <pre style={{ whiteSpace: 'pre-wrap' }}>{execution.stderr}</pre>}
                          </div>
                        )}
                        {execution.status === 'service_error' && (
                          <div className="stack stack-2">
                            <div className="row row-2" style={{ color: 'var(--error)', fontWeight: 600 }}><AlertCircle size={16} />Service unavailable</div>
                            <div>{execution.errorMessage}</div>
                          </div>
                        )}
                        {execution.status === 'timeout' && (
                          <div className="stack stack-2">
                            <div className="row row-2" style={{ color: 'var(--warning)', fontWeight: 600 }}><Clock size={16} />Timeout</div>
                            <div>{execution.errorMessage}</div>
                          </div>
                        )}
                        {execution.status === 'success' && (
                          <div className="stack stack-2">
                            {execution.stdout ? <pre style={{ whiteSpace: 'pre-wrap' }}>{execution.stdout}</pre> : <span className="text-tertiary">(no output)</span>}
                            {execution.stderr && <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--warning)' }}>{execution.stderr}</pre>}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'tests' && (
                  <>
                    {!submission && !isSubmitting && <span className="text-tertiary">Submit to run all test cases.</span>}
                    {isSubmitting && <span className="text-secondary">Running {exercise.testCases.length} test cases...</span>}
                    {submission && (
                      <div className="stack stack-4">
                        <div className={`row row-2 ${submission.status === 'accepted' ? 'text-success' : ''}`} style={{ fontWeight: 600, color: submission.status === 'accepted' ? 'var(--success)' : 'var(--error)' }}>
                          {submission.status === 'accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          {submission.status === 'accepted' ? 'Accepted' : submission.status === 'wrong_answer' ? 'Wrong Answer' : submission.status}
                          <span className="text-small" style={{ marginLeft: 8, color: 'var(--text-secondary)', fontWeight: 400 }}>
                            {submission.passed}/{submission.total} passed
                          </span>
                        </div>

                        <div className="stack stack-3">
                          {submission.results.map((r, idx) => (
                            <div key={idx} className="card" style={{ padding: 12, background: r.passed ? 'var(--success-subtle)' : 'var(--error-subtle)', borderColor: r.passed ? 'var(--success-border)' : 'var(--error-border)' }}>
                              <div className="row row-between" style={{ marginBottom: 8 }}>
                                <span style={{ fontWeight: 600, fontSize: 13 }}>Test {idx + 1} {r.isHidden ? '(hidden)' : ''}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: r.passed ? 'var(--success)' : 'var(--error)' }}>{r.passed ? 'Passed' : 'Failed'}</span>
                              </div>
                              {!r.isHidden || !r.passed ? (
                                <div className="grid" style={{ gap: 8, fontSize: 12 }}>
                                  <div><span className="text-tertiary">Input:</span><pre style={{ marginTop: 2, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.04)', padding: 6, borderRadius: 6 }}>{r.input || '(empty)'}</pre></div>
                                  {!r.isHidden && (
                                    <>
                                      <div><span className="text-tertiary">Expected:</span><pre style={{ marginTop: 2, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.04)', padding: 6, borderRadius: 6 }}>{r.expected}</pre></div>
                                      <div><span className="text-tertiary">Actual:</span><pre style={{ marginTop: 2, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.04)', padding: 6, borderRadius: 6 }}>{r.actual}</pre></div>
                                    </>
                                  )}
                                  {r.isHidden && !r.passed && <div className="text-tertiary">Hidden test case failed. Check edge cases.</div>}
                                </div>
                              ) : (
                                <div className="text-small text-secondary">Hidden test passed.</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
