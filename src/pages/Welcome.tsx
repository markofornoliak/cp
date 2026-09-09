import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-hero">
      <div className="welcome-card fade-in">
        <div className="welcome-content">
          <div className="stack stack-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Modern C++ • C++17/20 • Production Ready
            </div>

            <h1 className="h1" style={{ maxWidth: 480 }}>
              Learn
              <br />
              C++
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.5, color: '#475569', maxWidth: 440 }}>
              Build skills.<br />
              Solve problems.<br />
              Create what’s next.
            </p>

            <div className="stack stack-3" style={{ maxWidth: 440 }}>
              <div className="row row-3">
                <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                <span className="text-small text-secondary">Structured curriculum from foundations to modern idioms</span>
              </div>
              <div className="row row-3">
                <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                <span className="text-small text-secondary">Real C++ execution in browser with instant feedback</span>
              </div>
              <div className="row row-3">
                <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                <span className="text-small text-secondary">Progress persists locally — no account required</span>
              </div>
            </div>

            <div className="row row-3" style={{ marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                Start Learning
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/learn')}>
                Browse Curriculum
              </button>
            </div>

            <p className="text-small text-tertiary" style={{ marginTop: 8 }}>
              Free. No sign-up. Works offline after first load.
            </p>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="welcome-code-preview">
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div><span className="cm">// Modern C++</span></div>
            <div><span className="kw">#include</span> <span className="str">&lt;vector&gt;</span></div>
            <div><span className="kw">#include</span> <span className="str">&lt;algorithm&gt;</span></div>
            <br />
            <div><span className="ty">auto</span> <span className="fn">main</span>() -&gt; <span className="ty">int</span> {"{"}</div>
            <div>&nbsp;&nbsp;<span className="ty">std::vector</span> v{"{"}<span className="ty">1,2,3,4,5</span>{"}"};</div>
            <div>&nbsp;&nbsp;<span className="ty">auto</span> even = [](<span className="ty">int</span> x){"{"}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> x % <span className="ty">2</span> == <span className="ty">0</span>;</div>
            <div>&nbsp;&nbsp;{"}"};</div>
            <div>&nbsp;&nbsp;<span className="ty">std::erase_if</span>(v, even);</div>
            <div>&nbsp;&nbsp;<span className="kw">return</span> <span className="ty">0</span>;</div>
            <div>{"}"}</div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
              <span>✓ Compiles with C++20</span>
              <span>● Ready to run</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
