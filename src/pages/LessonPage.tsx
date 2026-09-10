import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, BookOpen, Code2 } from 'lucide-react';
import { lessons } from '../content/lessons';
import { modules } from '../content/modules';
import { exercises } from '../content/exercises';
import { CodeBlock } from '../components/CodeBlock';
import { useProgress } from '../hooks/useProgress';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, markLessonComplete, setCurrentLesson } = useProgress();

  const lesson = useMemo(() => lessons.find(l => l.id === lessonId), [lessonId]);
  const module = useMemo(() => lesson ? modules.find(m => m.id === lesson.moduleId) : null, [lesson]);
  const lessonExercises = useMemo(() => lesson ? exercises.filter(e => lesson.exerciseIds.includes(e.id)) : [], [lesson]);

  if (!lesson) {
    return (
      <div className="page page-reading">
        <div className="empty-state">
          <h3>Lesson not found</h3>
          <p>The lesson you’re looking for doesn’t exist.</p>
          <Link to="/learn" className="btn btn-secondary" style={{ marginTop: 16 }}>Back to curriculum</Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const prevLesson = lesson.prevLessonId ? lessons.find(l => l.id === lesson.prevLessonId) : null;
  const nextLesson = lesson.nextLessonId ? lessons.find(l => l.id === lesson.nextLessonId) : null;

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    if (nextLesson) {
      setCurrentLesson(nextLesson.id);
    }
  };

  // Set current lesson on view
  if (progress.currentLessonId !== lesson.id) {
    // Avoid infinite loop by checking
    setTimeout(() => setCurrentLesson(lesson.id), 0);
  }

  return (
    <div className="page page-reading">
      <div className="stack stack-8">
        <Link to="/learn" className="row row-2 text-small text-secondary" style={{ width: 'fit-content' }}>
          <ArrowLeft size={16} />
          Back to curriculum
        </Link>

        <div className="lesson-header">
          <div className="lesson-meta">
            {module && <span className="badge badge-neutral">{module.title}</span>}
            <span className="row row-2"><Clock size={14} />{lesson.durationMinutes} min</span>
            {isCompleted && <span className="row row-2" style={{ color: 'var(--success)' }}><CheckCircle2 size={14} />Completed</span>}
          </div>
          <h1 className="h2" style={{ marginBottom: 12 }}>{lesson.title}</h1>
          <p className="text-secondary" style={{ fontSize: 16 }}>{lesson.description}</p>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lesson.objectives.map((obj, i) => (
              <span key={i} className="badge badge-neutral" style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>{obj}</span>
            ))}
          </div>
        </div>

        <div className="stack stack-6">
          {lesson.theory.map((block, idx) => {
            switch (block.type) {
              case 'paragraph':
                return <p key={idx} style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text)' }}>{block.text}</p>;
              case 'heading':
                return block.level === 3
                  ? <h3 key={idx} className="h3" style={{ marginTop: 8 }}>{block.text}</h3>
                  : <h2 key={idx} className="h3" style={{ fontSize: 22, marginTop: 12 }}>{block.text}</h2>;
              case 'code':
                return <CodeBlock key={idx} code={block.code} caption={block.caption} />;
              case 'callout':
                return <div key={idx} className={`callout callout-${block.variant || 'info'}`}>{block.text}</div>;
              case 'list':
                return block.ordered
                  ? <ol key={idx} style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'decimal' }}>{block.items.map((it, i) => <li key={i} style={{ fontSize: 15 }}>{it}</li>)}</ol>
                  : <ul key={idx} style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'disc' }}>{block.items.map((it, i) => <li key={i} style={{ fontSize: 15 }}>{it}</li>)}</ul>;
              case 'divider':
                return <hr key={idx} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />;
              default:
                return null;
            }
          })}

          {lesson.examples.length > 0 && (
            <div className="stack stack-4" style={{ marginTop: 8 }}>
              <h3 className="h3">Examples</h3>
              {lesson.examples.map(ex => (
                <div key={ex.id} className="stack stack-3">
                  {ex.title && <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.title}</div>}
                  <CodeBlock code={ex.code} />
                  {ex.explanation && <p className="text-small text-secondary">{ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="card" style={{ padding: 20, background: 'var(--bg-subtle)', borderStyle: 'dashed' }}>
            <div className="stack stack-2">
              <div className="row row-2" style={{ fontWeight: 600 }}><BookOpen size={18} />Key takeaway</div>
              <p className="text-secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>{lesson.takeaway}</p>
            </div>
          </div>

          {lessonExercises.length > 0 && (
            <div className="stack stack-4">
              <h3 className="h3">Practice</h3>
              <div className="grid" style={{ gap: 12 }}>
                {lessonExercises.map(ex => (
                  <Link key={ex.id} to={`/practice/${ex.id}`} className="card card-hover" style={{ padding: 16 }}>
                    <div className="row row-between">
                      <div className="stack stack-2">
                        <div className="row row-2">
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{ex.title}</span>
                          <span className={`badge badge-${ex.difficulty.toLowerCase()}`}>{ex.difficulty}</span>
                        </div>
                        <span className="text-small text-secondary">{ex.description}</span>
                      </div>
                      <Code2 size={18} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="row row-between">
            <div style={{ fontWeight: 600 }}>Lesson complete?</div>
            {isCompleted ? (
              <span className="row row-2" style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}><CheckCircle2 size={16} />Completed</span>
            ) : (
              <button className="btn btn-primary" onClick={handleComplete}>Mark complete</button>
            )}
          </div>

          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            {prevLesson && (
              <button className="btn btn-secondary" onClick={() => navigate(`/learn/${prevLesson.id}`)}>
                <ArrowLeft size={16} />
                {prevLesson.title}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {nextLesson ? (
              <button className="btn btn-primary" onClick={() => navigate(`/learn/${nextLesson.id}`)}>
                Next: {nextLesson.title}
                <ArrowRight size={16} />
              </button>
            ) : (
              <Link to="/learn" className="btn btn-secondary">Back to curriculum</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
