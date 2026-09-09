import { Link, useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { Clock, CheckCircle2, ArrowLeft, Lightbulb } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

export function ProjectsList() {
  const { progress } = useProgress();

  return (
    <div className="page page-wide">
      <div className="stack stack-8">
        <div className="stack stack-3">
          <h1 className="h2">Projects</h1>
          <p className="text-secondary" style={{ maxWidth: 600 }}>Apply what you’ve learned. Each project is scoped for a few hours and designed to produce something you can keep.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {projects.map(proj => {
            const isCompleted = progress.completedProjects.includes(proj.id);
            return (
              <Link key={proj.id} to={`/projects/${proj.id}`} className="card card-hover" style={{ padding: 22 }}>
                <div className="stack stack-4">
                  <div className="row row-between">
                    <span className={`badge badge-${proj.difficulty === 'Beginner' ? 'easy' : proj.difficulty === 'Intermediate' ? 'medium' : 'hard'}`}>{proj.difficulty}</span>
                    <span className="row row-2 text-small text-tertiary"><Clock size={14} />{proj.estimatedHours}h</span>
                  </div>
                  <div>
                    <div className="row row-2">
                      <h3 style={{ fontWeight: 650, fontSize: 17 }}>{proj.title}</h3>
                      {isCompleted && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                    </div>
                    <p className="text-small text-secondary" style={{ marginTop: 6, lineHeight: 1.5 }}>{proj.description}</p>
                  </div>
                  <div className="row row-2" style={{ flexWrap: 'wrap' }}>
                    {proj.concepts.map(c => <span key={c} className="badge badge-neutral" style={{ textTransform: 'none', fontWeight: 400 }}>{c}</span>)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const { progress, markProjectComplete } = useProgress();
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="page page-reading">
        <div className="empty-state">
          <h3>Project not found</h3>
          <Link to="/projects" className="btn btn-secondary" style={{ marginTop: 16 }}>Back to projects</Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedProjects.includes(project.id);

  return (
    <div className="page page-reading">
      <div className="stack stack-8">
        <Link to="/projects" className="row row-2 text-small text-secondary" style={{ width: 'fit-content' }}>
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="stack stack-4">
          <div className="row row-3">
            <span className={`badge badge-${project.difficulty === 'Beginner' ? 'easy' : project.difficulty === 'Intermediate' ? 'medium' : 'hard'}`}>{project.difficulty}</span>
            <span className="row row-2 text-small text-tertiary"><Clock size={14} />{project.estimatedHours}h</span>
            {isCompleted && <span className="row row-2 text-small" style={{ color: 'var(--success)', fontWeight: 600 }}><CheckCircle2 size={14} />Completed</span>}
          </div>
          <h1 className="h2">{project.title}</h1>
          <p className="text-secondary" style={{ fontSize: 16 }}>{project.description}</p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Goal</h3>
          <p style={{ lineHeight: 1.6 }}>{project.goal}</p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Requirements</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.requirements.map((r, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.6 }}>{r}</li>)}
          </ul>
        </div>

        <div className="stack stack-4">
          <h3 className="h3">Milestones</h3>
          <div className="stack stack-3">
            {project.milestones.map((m, i) => (
              <div key={i} className="card" style={{ padding: 18, display: 'flex', gap: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.title}</div>
                  <div className="text-small text-secondary">{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {project.starterCode && (
          <div className="stack stack-3">
            <h3 className="h3">Starter code</h3>
            <div className="code-block">
              <div className="code-block-header">C++</div>
              <div className="code-block-content"><pre><code>{project.starterCode}</code></pre></div>
            </div>
          </div>
        )}

        {project.hints && (
          <div className="card" style={{ padding: 20, background: 'var(--bg-subtle)' }}>
            <div className="row row-2" style={{ fontWeight: 600, marginBottom: 12 }}><Lightbulb size={18} />Hints</div>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.hints.map((h, i) => <li key={i} className="text-small text-secondary">{h}</li>)}
            </ul>
          </div>
        )}

        <div className="card" style={{ padding: 20 }}>
          <div className="row row-between">
            <div>
              <div style={{ fontWeight: 600 }}>Project status</div>
              <div className="text-small text-secondary">{isCompleted ? 'You marked this project as completed.' : 'Mark complete when you finish the requirements.'}</div>
            </div>
            {isCompleted ? (
              <span className="row row-2" style={{ color: 'var(--success)', fontWeight: 600 }}><CheckCircle2 size={18} />Completed</span>
            ) : (
              <button className="btn btn-primary" onClick={() => markProjectComplete(project.id)}>Mark complete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
