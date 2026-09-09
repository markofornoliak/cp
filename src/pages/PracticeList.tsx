import { Link } from 'react-router-dom';
import { exercises } from '../content/exercises';
import { useProgress } from '../hooks/useProgress';
import { CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';

type Filter = 'all' | 'Easy' | 'Medium' | 'Hard';

export function PracticeList() {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      if (filter !== 'all' && ex.difficulty !== filter) return false;
      if (search && !ex.title.toLowerCase().includes(search.toLowerCase()) && !ex.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search]);

  return (
    <div className="page page-wide">
      <div className="stack stack-8">
        <div className="stack stack-4">
          <h1 className="h2">Practice</h1>
          <p className="text-secondary" style={{ maxWidth: 600 }}>Solve real problems with a real compiler. Each exercise runs in your browser via Piston — no setup needed.</p>
        </div>

        <div className="row row-3" style={{ flexWrap: 'wrap' }}>
          <div className="row row-2">
            {(['all', 'Easy', 'Medium', 'Hard'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              fontSize: 14,
              minWidth: 220,
            }}
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(ex => {
            const isCompleted = progress.completedExercises.includes(ex.id);
            return (
              <Link key={ex.id} to={`/practice/${ex.id}`} className="card card-hover" style={{ padding: 18 }}>
                <div className="stack stack-3">
                  <div className="row row-between">
                    <span className={`badge badge-${ex.difficulty.toLowerCase()}`}>{ex.difficulty}</span>
                    {isCompleted && <span className="row row-2 text-small" style={{ color: 'var(--success)', fontWeight: 600 }}><CheckCircle2 size={14} />Solved</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{ex.title}</div>
                    <div className="text-small text-secondary" style={{ lineHeight: 1.5 }}>{ex.description}</div>
                  </div>
                  <div className="row row-2" style={{ flexWrap: 'wrap' }}>
                    {ex.concepts.slice(0, 3).map(c => (
                      <span key={c} className="badge badge-neutral" style={{ textTransform: 'none', fontWeight: 400 }}>{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>No exercises found</h3>
            <p>Try adjusting filters or search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
