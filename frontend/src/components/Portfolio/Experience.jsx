import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, revealViewport } from '../../utils/motion';

const Experience = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/experience')
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && entries.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="experience" className="section experience">
      <h2 className="section-title">
        Work <span className="accent">Experience</span>
      </h2>
      <motion.div
        className="container-narrow timeline"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.1)}
      >
        {loading &&
          [0, 1].map((i) => (
            <div className="timeline__row" key={i}>
              <div className="timeline__marker">
                <span className="timeline__dot" />
              </div>
              <div className="card timeline__card timeline__card--skeleton" />
            </div>
          ))}

        {!loading &&
          entries.map((exp, i) => (
            <motion.div className="timeline__row" key={exp._id} variants={fadeInUp}>
              <div className="timeline__marker">
                <span className="timeline__dot" />
                {i < entries.length - 1 && <span className="timeline__line" />}
              </div>
              <motion.div className="card timeline__card" whileHover={hoverBounce.whileHover}>
                <div className="timeline__card-icon">💼</div>
                <div>
                  <h3 className="timeline__card-title">{exp.role}</h3>
                  <p className="timeline__card-org">{exp.organization}</p>
                  <p className="timeline__card-desc">{exp.description}</p>
                  <div className="timeline__card-footer">
                    <span className="badge-chip">{exp.period}</span>
                    <span className="badge-chip badge-chip--accent">{exp.tag}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
      </motion.div>
    </AnimatedSection>
  );
};

export default Experience;
