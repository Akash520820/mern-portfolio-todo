import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, revealViewport } from '../../utils/motion';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/certifications')
      .then(({ data }) => setCerts(data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && certs.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="certifications" className="section certifications">
      <h2 className="section-title">
        <span className="accent">Certifications</span>
      </h2>
      <div className="container-narrow card certifications__panel">
        {loading ? (
          <p className="admin-list__empty">Loading…</p>
        ) : (
          <motion.div
            className="certifications__grid"
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={staggerContainer(0.06)}
          >
            {certs.map((c) => {
              const content = (
                <>
                  <div className="certifications__icon">🎖</div>
                  <div>
                    <h4 className="certifications__title">{c.title}</h4>
                    <p className="certifications__issuer">
                      {c.issuer}
                      {c.date ? ` · ${c.date}` : ''}
                    </p>
                  </div>
                </>
              );
              return c.url ? (
                <motion.a
                  className="certifications__item"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={c._id}
                  variants={fadeInUp}
                  whileHover={hoverBounce.whileHover}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.div className="certifications__item" key={c._id} variants={fadeInUp} whileHover={hoverBounce.whileHover}>
                  {content}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Certifications;
