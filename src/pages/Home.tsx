import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, FolderKanban, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { lessons } from '../content/lessons';
import { modules } from '../content/modules';
import { exercises } from '../content/exercises';

export function Home() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const stats = useMemo(() => {
    const totalLessons = lessons.length;
    const completed = progress.completedLessons.length;
    const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
    return { totalLessons, completed, pct };
  }, [progress.completedLessons.length]);

  const continueLesson = useMemo(() => {
    if (progress.currentLessonId) {
      const found = lessons.find(l => l.id === progress.currentLessonId);
      if (found) return found;
    }
    // Find first incomplete
    const incomplete = lessons.find(l => !progress.completedLessons.includes(l.id));
    return incomplete || lessons[0];
  }, [progress.currentLessonId, progress.completedLessons]);

  const continueModule = useMemo(() => {
    if (!continueLesson) return null;
    return modules.find(m => m.id === continueLesson.moduleId);
  }, [continueLesson]);

  const lessonIndexInModule = useMemo(() => {
    if (!continueLesson || !continueModule) return null;
    const idx = continueModule.lessonIds.indexOf(continueLesson.id);
    return { current: idx + 1, total: continueModule.lessonIds.length };
  }, [continueLesson, continueModule]);

  return (
    <div className="page page-wide">
      <div className="stack stack-8">
        {/* Header */}
        <div className="stack stack-4">
          <h1 className="h2">Learn C++</h1>
          <div className="row row-4" style={{ flexWrap: 'wrap' }}>
            <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                <BarChart3 size={18} />
              </div>
              <div>
                <div className="text-small text-secondary">Progress</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{stats.pct}% • {stats.completed}/{stats.totalLessons} lessons</div>
              </div>
              <div style={{ width: 80, marginLeft: 8 }}>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${stats.pct}%` }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                <Code2 size={18} />
              </div>
              <div>
                <div className="text-small text-secondary">Exercises</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{progress.completedExercises.length}/{exercises.length} solved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning - dominant */}
        {continueLesson && continueModule && (
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)' }}>
            <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="row row-between" style={{ alignItems: 'flex-start' }}>
                <div className="stack stack-3">
                  <div className="row row-2">
                    <span className="badge badge-neutral">{continueModule.title}</span>
                    {lessonIndexInModule && (
                      <span className="text-small text-tertiary">
                        Lesson {lessonIndexInModule.current} of {lessonIndexInModule.total} • {continueLesson.durationMinutes} min
                      </span>
                    )}
                  </div>
                  <h2 className="h3" style={{ fontSize: 26, maxWidth: 520, lineHeight: 1.15 }}>{continueLesson.title}</h2>
                  <p className="text-secondary" style={{ maxWidth: 520 }}>{continueLesson.description}</p>
                </div>
                <div style={{ display: 'none' }}>
                  {/* placeholder for visual */}
                </div>
              </div>

              <div className="row row-3">
                <button className="btn btn-primary btn-lg" onClick={() => navigate(`/learn/${continueLesson.id}`)}>
                  Continue
                  <ArrowRight size={18} />
                </button>
                <Link to="/learn" className="btn btn-secondary btn-lg">View curriculum</Link>
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--bg-muted)' }}>
              <div style={{ height: '100%', width: `${stats.pct}%`, background: 'var(--text)', transition: 'width 400ms ease' }} />
            </div>
          </div>
        )}

        {/* Gateways */}
        <div>
          <h3 className="h3" style={{ marginBottom: 16 }}>Explore</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <Link to="/learn" className="card card-hover" style={{ padding: 20 }}>
              <div className="stack stack-4">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Courses</div>
                  <div className="text-small text-secondary">6 modules • {lessons.length} lessons • progressive difficulty</div>
                </div>
              </div>
            </Link>

            <Link to="/practice" className="card card-hover" style={{ padding: 20 }}>
              <div className="stack stack-4">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                  <Code2 size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Practice</div>
                  <div className="text-small text-secondary">{exercises.length} exercises • real compiler • instant feedback</div>
                </div>
              </div>
            </Link>

            <Link to="/projects" className="card card-hover" style={{ padding: 20 }}>
              <div className="stack stack-4">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                  <FolderKanban size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Projects</div>
                  <div className="text-small text-secondary">4 guided projects • from CLI tools to data processing</div>
                </div>
              </div>
            </Link>

            <Link to="/progress" className="card card-hover" style={{ padding: 20 }}>
              <div className="stack stack-4">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Progress</div>
                  <div className="text-small text-secondary">Track lessons, exercises, and recent activity</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recently completed */}
        {progress.completedLessons.length > 0 && (
          <div>
            <h3 className="h3" style={{ marginBottom: 16 }}>Recently completed</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {progress.completedLessons.slice(-4).reverse().map(id => {
                const lesson = lessons.find(l => l.id === id);
                if (!lesson) return null;
                const mod = modules.find(m => m.id === lesson.moduleId);
                return (
                  <Link key={id} to={`/learn/${lesson.id}`} className="row row-between" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', transition: 'background 150ms' }}>
                    <div className="row row-3">
                      <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{lesson.title}</div>
                        <div className="text-small text-tertiary">{mod?.title}</div>
                      </div>
                    </div>
                    <div className="row row-2 text-small text-tertiary">
                      <Clock size={14} />
                      {lesson.durationMinutes}m
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
