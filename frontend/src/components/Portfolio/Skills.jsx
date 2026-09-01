import { useState } from 'react';

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
    <section id="skills" className="section skills">
      <h2 className="section-title">
        <span className="accent">Skills</span>
      </h2>

      <div className="container-narrow">
        <div className="skills__tabs" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={active === cat.key}
              className={`skills__tab ${active === cat.key ? 'is-active' : ''}`}
              onClick={() => setActive(cat.key)}
            >
              <span className="skills__tab-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="card skills__panel">
          <h3 className="skills__panel-title">{current.label}</h3>
          <div className="skills__items">
            {current.items.map((item) => (
              <div className="skills__item" key={item}>
                <span className="skills__item-icon">{'</>'}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card skills__tools">
          <h3 className="skills__panel-title">AI &amp; Developer Tooling</h3>
          <div className="skills__chip-row">
            {TOOLS.map((tool) => (
              <span className="badge-chip" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
