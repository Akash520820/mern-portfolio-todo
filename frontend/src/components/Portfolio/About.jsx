import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, revealViewport } from '../../utils/motion';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/profile'), api.get('/education')])
      .then(([profileRes, eduRes]) => {
        setProfile(profileRes.data);
        setEducation(eduRes.data);
      })
      .catch(() => {
        setProfile(null);
        setEducation([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedSection id="about" className="section about">
      <h2 className="section-title">
        My <span className="accent">Professional</span> Side
      </h2>
      <motion.div
        className="container-narrow about__grid"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={fadeInUp} whileHover={hoverBounce.whileHover} className="card about__bio">
          {loading ? (
            <div className="about__bio-text about__bio-text--skeleton" />
          ) : (
            <p className="about__bio-text">
              {profile?.bio ||
                "I'm a developer who enjoys building software that grows and makes a real difference."}
            </p>
          )}
          <ul className="about__meta-list">
            <li>
              <span className="about__meta-label">Email</span>
              <span className="about__meta-value">{profile?.email || 'you@example.com'}</span>
            </li>
            <li>
              <span className="about__meta-label">Location</span>
              <span className="about__meta-value">{profile?.location || 'Your City, Country'}</span>
            </li>
            <li>
              <span className="about__meta-label">Education</span>
              <span className="about__meta-value">{profile?.educationSummary || 'B.Tech in Computer Science'}</span>
            </li>
          </ul>
          {(profile?.coreAreas?.length > 0 || loading) && (
            <>
              <h4 className="about__core-title">Core Areas</h4>
              <div className="about__chips">
                {(profile?.coreAreas || []).map((area) => (
                  <span key={area} className="badge-chip">
                    {area}
                  </span>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} className="about__education">
          <h3 className="about__edu-heading">Education</h3>
          {loading &&
            [0, 1].map((i) => <div className="card about__edu-card about__edu-card--skeleton" key={i} />)}

          {!loading && education.length === 0 && (
            <p className="admin-list__empty">Education details coming soon.</p>
          )}

          {!loading &&
            education.map((edu) => (
              <motion.div
                className="card about__edu-card"
                key={edu._id}
                whileHover={hoverBounce.whileHover}
                whileTap={hoverBounce.whileTap}
              >
                <h4 className="about__edu-degree">{edu.degree}</h4>
                <p className="about__edu-school">{edu.school}</p>
                <div className="about__edu-footer">
                  <span>{edu.period}</span>
                  <span>{edu.detail}</span>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
};

export default About;
