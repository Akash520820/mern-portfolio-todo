import { useEffect, useRef, useState } from 'react';

// Sections tracked as a growing "file path" breadcrumb, IDE-style.
const SECTIONS = [
  { id: 'home', label: 'intro' },
  { id: 'about', label: 'about_me' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'experience', label: 'experience' },
  { id: 'goals', label: 'goals' },
  { id: 'achievements', label: 'achievements' },
  { id: 'certifications', label: 'certifications' },
  { id: 'contact', label: 'contact' },
];

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
        const pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
        setProgress(pct);

        let current = 0;
        SECTIONS.forEach((s, i) => {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
            current = i;
          }
        });
        setActiveIndex(current);

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isComplete = progress >= 99;
  const visited = SECTIONS.slice(0, activeIndex + 1);

  return (
    <div className="scroll-terminal" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="scroll-terminal__pct">
        <span className="scroll-terminal__arrow">→</span>
        <span className="scroll-terminal__num">{progress}%</span>
      </div>
      <div className="scroll-terminal__track">
        <div className="scroll-terminal__fill" style={{ width: `${progress}%` }}>
          <span className="scroll-terminal__breadcrumb">
            {visited.map((s) => `{${s.label}}`).join('')}
            <span className="scroll-terminal__cursor">_</span>
          </span>
        </div>
      </div>
      <div className="scroll-terminal__remaining">
        {isComplete ? 'complete' : `${100 - progress}% remaining`}
      </div>
    </div>
  );
};

export default ScrollProgressBar;
