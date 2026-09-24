import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, buttonBounce, revealViewport } from '../../utils/motion';

// "Label: https://url" -> { label, url }. Tolerates URLs that contain ":"
// by only splitting on the first colon.
const parseLink = (raw) => {
  const idx = raw.indexOf(':');
  if (idx === -1) return { label: 'Check out', url: raw.trim() };
  const label = raw.slice(0, idx).trim();
  const url = raw.slice(idx + 1).trim();
  return { label: label || 'Check out', url };
};

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
    <AnimatedSection id="projects" className="section projects">
      <h2 className="section-title">
        Stuff I <span className="accent">Built</span>
      </h2>

      <motion.div
        className="container-narrow projects__list"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.12)}
      >
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
            <motion.div
              className="projects__row"
              key={p._id}
              variants={fadeInUp}
              whileHover={hoverBounce.whileHover}
            >
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
                  {/* Single-URL (monolithic) projects keep the one button in the header, same as before */}
                  {p.url && !(p.links?.length > 0) && (
                    <motion.a
                      href={p.url}
                      className="btn-outline-glow projects__check"
                      target="_blank"
                      rel="noreferrer"
                      {...buttonBounce}
                    >
                      Check out ↗
                    </motion.a>
                  )}
                </div>
                <p className="projects__tagline">{p.tagline}</p>
                {/* Multi-service projects show one button per link instead */}
                {p.links?.length > 0 && (
                  <div className="projects__links">
                    {p.links.map((raw) => {
                      const { label, url } = parseLink(raw);
                      if (!url) return null;
                      return (
                        <motion.a
                          key={raw}
                          href={url}
                          className="btn-outline-glow projects__check"
                          target="_blank"
                          rel="noreferrer"
                          {...buttonBounce}
                        >
                          {label} ↗
                        </motion.a>
                      );
                    })}
                  </div>
                )}
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
            </motion.div>
          ))}
      </motion.div>
    </AnimatedSection>
  );
};

export default Projects;