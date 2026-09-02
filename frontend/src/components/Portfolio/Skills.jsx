import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, buttonBounce, revealViewport } from '../../utils/motion';

const CATEGORIES = [
  {
    key: 'languages',
    label: 'Programming Languages',
    icon: '{}',
    items: ['Java', 'JavaScript'],
  },
  {
    key: 'frontend',
    label: 'Frontend Development',
    icon: '◱',
    items: ['React', 'Next.js', 'Bootstrap'],
  },
  {
    key: 'backend',
    label: 'Backend Development',
    icon: '▤',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth', 'MongoDB', 'Mongoose'],
  },
  {
    key: 'cloud',
    label: 'Cloud & Deployment',
    icon: '☁',
    items: ['AWS EC2 & S3', 'Docker', 'CI/CD', 'Vercel', 'Render'],
  },
];

const TOOLS = ['Git', 'GitHub', 'Postman', 'VS Code', 'Claude', 'ChatGPT', 'Docker'];

const Skills = () => {
  const [active, setActive] = useState(CATEGORIES[0].key);
  const current = CATEGORIES.find((c) => c.key === active);

  return (
    <AnimatedSection id="skills" className="section skills">
      <h2 className="section-title">
        <span className="accent">Skills</span>
      </h2>

      <motion.div
        className="container-narrow"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.08)}
      >
        <motion.div variants={fadeInUp} className="skills__tabs" role="tablist">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              role="tab"
              aria-selected={active === cat.key}
              className={`skills__tab ${active === cat.key ? 'is-active' : ''}`}
              onClick={() => setActive(cat.key)}
              {...buttonBounce}
            >
              <span className="skills__tab-icon">{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="card skills__panel">
          <h3 className="skills__panel-title">{current.label}</h3>
          <div className="skills__items">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="skills__items"
                style={{ display: 'contents' }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer(0.04)}
              >
                {current.items.map((item) => (
                  <motion.div className="skills__item" key={item} variants={fadeInUp} whileHover={hoverBounce.whileHover}>
                    <span className="skills__item-icon">{'</>'}</span>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="card skills__tools">
          <h3 className="skills__panel-title">AI &amp; Developer Tooling</h3>
          <div className="skills__chip-row">
            {TOOLS.map((tool) => (
              <motion.span className="badge-chip" key={tool} whileHover={hoverBounce.whileHover}>
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
};

export default Skills;
