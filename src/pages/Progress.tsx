import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { lessons } from '../content/lessons';
import { exercises } from '../content/exercises';
import { modules } from '../content/modules';
import { projects } from '../content/projects';
import { CheckCircle2, Clock } from 'lucide-react';
import { useMemo } from 'react';

export function ProgressPage() {
  const { progress } = useProgress();

  const stats = useMemo(() => {
    const totalLessons = lessons.length;
    const completedLessons = progress.completedLessons.length;
    const lessonPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const totalExercises = exercises.length;
    const completedExercises = progress.completedExercises.length;
    const exercisePct = totalExercises ? Math.round((completedExercises / totalExercises) * 100) : 0;

    const totalProjects = projects.length;
    const completedProjects = progress.completedProjects.length;

    return { totalLessons, completedLessons, lessonPct, totalExercises, completedExercises, exercisePct, totalProjects, completedProjects };
  }, [progress]);

  const recentLessons = useMemo(() => {
    return progress.completedLessons.slice(-6).reverse().map(id => lessons.find(l => l.id === id)).filter(Boolean);
  }, [progress.completedLessons]);

  return (
    <div className="page page-wide">
      <div className="stack stack-8">
        <div className="stack stack-3">
          <h1 className="h2">Progress</h1>
          <p className="text-secondary">Your learning is stored locally and persists across refreshes. No account needed.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="text-small text-secondary" style={{ marginBottom: 8 }}>Lessons</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{stats.completedLessons} / {stats.totalLessons}</div>
            <div className="progress-bar" style={{ marginTop: 12 }}><div className="progress-bar-fill" style={{ width: `${stats.lessonPct}%` }} /></div>
            <div className="text-small text-tertiary" style={{ marginTop: 6 }}>{stats.lessonPct}% complete</div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="text-small text-secondary" style={{ marginBottom: 8 }}>Exercises</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{stats.completedExercises} / {stats.totalExercises}</div>
            <div className="progress-bar" style={{ marginTop: 12 }}><div className="progress-bar-fill" style={{ width: `${stats.exercisePct}%` }} /></div>
            <div className="text-small text-tertiary" style={{ marginTop: 6 }}>{stats.exercisePct}% complete</div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="text-small text-secondary" style={{ marginBottom: 8 }}>Projects</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{stats.completedProjects} / {stats.totalProjects}</div>
            <div className="text-small text-tertiary" style={{ marginTop: 12 }}>Guided builds to consolidate skills</div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div className="stack stack-4">
            <h3 className="h3" style={{ fontSize: 18 }}>Modules</h3>
            <div className="stack stack-3">
              {modules.map(mod => {
                const modLessons = mod.lessonIds.map(id => lessons.find(l => l.id === id)!).filter(Boolean);
                const completed = modLessons.filter(l => progress.completedLessons.includes(l.id)).length;
                const pct = modLessons.length ? Math.round((completed / modLessons.length) * 100) : 0;
                return (
                  <div key={mod.id} className="card" style={{ padding: 16 }}>
                    <div className="row row-between" style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{mod.title}</span>
                      <span className="text-small text-tertiary">{completed}/{modLessons.length}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stack stack-4">
            <h3 className="h3" style={{ fontSize: 18 }}>Recently completed</h3>
            {recentLessons.length === 0 ? (
              <div className="card" style={{ padding: 20 }}>
                <div className="empty-state" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14 }}>No activity yet</h3>
                  <p className="text-small">Complete a lesson to see it here.</p>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {recentLessons.map((lesson) => (
                  lesson ? (
                  <Link key={lesson.id} to={`/learn/${lesson.id}`} className="row row-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div className="row row-2">
                      <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{lesson.title}</span>
                    </div>
                    <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                  </Link>
                  ) : null
                ))}
              </div>
            )}

            <div className="card" style={{ padding: 16 }}>
              <h4 style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Keep going</h4>
              <p className="text-small text-secondary" style={{ lineHeight: 1.5 }}>Consistency beats intensity. One lesson a day is enough to build lasting skill.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
