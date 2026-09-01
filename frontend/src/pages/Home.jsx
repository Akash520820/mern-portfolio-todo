import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Portfolio/Hero';
import About from '../components/Portfolio/About';
import Skills from '../components/Portfolio/Skills';
import Projects from '../components/Portfolio/Projects';
import Experience from '../components/Portfolio/Experience';
import Goals from '../components/Portfolio/Goals';
import Certifications from '../components/Portfolio/Certifications';
import Contact from '../components/Portfolio/Contact';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navbar sends { state: { scrollTo: id } } when a section link is clicked
  // from a different page (e.g. /login) — scroll to that section once this
  // page has mounted, then clear the state so refreshing/back-navigating
  // here doesn't re-trigger the scroll.
  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Goals />
      <Certifications />
      <Contact />
    </div>
  );
};

export default Home;
