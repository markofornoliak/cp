import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Play } from 'lucide-react';
import { modules } from '../content/modules';
import { lessons } from '../content/lessons';
import { useProgress } from '../hooks/useProgress';
import { useState } from 'react';

export function Learn() {
  const { progress } = useProgress();
  const [expanded, setExpanded] = useState<string[]>(() => modules.map(m => m.id));

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="page page-wide">
      <div className="stack stack-8">
        <div className="stack stack-3">
          <h1 className="h2">Curriculum</h1>
          <p className="text-secondary" style={{ maxWidth: 600 }}>
            A progression from foundations to modern C++. Each lesson is concise, example-driven, and builds on the previous. No artificial locking — browse freely.
          </p>
        </div>

        <div className="stack stack-6">
          {modules.map(mod => {
            const modLessons = mod.lessonIds.map(id => lessons.find(l => l.id === id)!).filter(Boolean);
            const completedCount = modLessons.filter(l => progress.completedLessons.includes(l.id)).length;
            const isExpanded = expanded.includes(mod.id);
            const pct = modLessons.length ? Math.round((completedCount / modLessons.length) * 100) : 0;

            return (
              <div key={mod.id} className="card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => toggle(mod.id)}
                  className="row row-between"
                  style={{ width: '100%', padding: '20px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div className="stack stack-2">
                    <div className="row row-3">
                      <h3 className="h3" style={{ fontSize: 18 }}>{mod.title}</h3>
                      <span className="badge badge-neutral">{modLessons.length} lessons</span>
                      {completedCount > 0 && <span className="text-small text-secondary">{completedCount} completed</span>}
                    </div>
                    <p className="text-small text-secondary" style={{ maxWidth: 600 }}>{mod.description}</p>
                  </div>
                  <div className="row row-4">
                    <div style={{ width: 80 }}>
                      <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
                      <div className="text-small text-tertiary" style={{ marginTop: 4, textAlign: 'right' }}>{pct}%</div>
                    </div>
                    <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}>⌄</div>
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {modLessons.map(lesson => {
                      const isCompleted = progress.completedLessons.includes(lesson.id);
                      const isCurrent = progress.currentLessonId === lesson.id;
                      return (
                        <Link
                          key={lesson.id}
                          to={`/learn/${lesson.id}`}
                          className="row row-between"
                          style={{
                            padding: '16px 22px',
                            borderBottom: '1px solid var(--border)',
                            background: isCurrent ? 'var(--accent-subtle)' : 'transparent',
                            transition: 'background 150ms',
                          }}
                        >
                          <div className="row row-3">
                            {isCompleted ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Circle size={18} style={{ color: 'var(--border-strong)' }} />}
                            <div className="stack stack-1">
                              <div className="row row-2">
                                <span style={{ fontWeight: isCurrent ? 600 : 500, fontSize: 14 }}>{lesson.title}</span>
                                {isCurrent && <span className="badge" style={{ background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)', fontSize: 10 }}>Current</span>}
                              </div>
                              <span className="text-small text-tertiary" style={{ maxWidth: 480, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.description}</span>
                            </div>
                          </div>
                          <div className="row row-3">
                            <span className="row row-2 text-small text-tertiary">
                              <Clock size={14} />
                              {lesson.durationMinutes}m
                            </span>
                            <span className="btn btn-ghost btn-sm" style={{ height: 28 }}>
                              <Play size={14} />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
