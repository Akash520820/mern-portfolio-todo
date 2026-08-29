import { useEffect, useState } from 'react';
import api from '../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/projects')
      .then(({ data }) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section projects">
      <h2 className="section-title">
        Stuff I <span className="accent">Built</span>
      </h2>

      <div className="container-narrow projects__list">
        {loading &&
          [0, 1].map((i) => (
            <div className="projects__row" key={i}>
              <div className="projects__mockup projects__mockup--skeleton" />
              <div className="card projects__info projects__info--skeleton" />
            </div>
          ))}

        {!loading && projects.length === 0 && (
          <p className="projects__empty">Projects will show up here once they're added.</p>
        )}

        {!loading &&
          projects.map((p) => (
            <div className="projects__row" key={p._id}>
              <div className="projects__mockup" style={{ background: p.accentColor }}>
                <div className="projects__mockup-chrome">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="projects__mockup-title">{p.title}</div>
              </div>

              <div className="card projects__info">
                <div className="projects__info-header">
                  <h3>{p.title}</h3>
                  {p.url && (
                    <a href={p.url} className="btn-outline-glow projects__check" target="_blank" rel="noreferrer">
                      Check out ↗
                    </a>
                  )}
                </div>
                <p className="projects__tagline">{p.tagline}</p>
                {p.bullets?.length > 0 && (
                  <ul className="projects__bullets">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {p.tech?.length > 0 && (
                  <div className="projects__tech">
                    {p.tech.map((t) => (
                      <span className="badge-chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Projects;
