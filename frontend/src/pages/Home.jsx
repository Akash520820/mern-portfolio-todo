import Hero from '../components/Portfolio/Hero';
import About from '../components/Portfolio/About';
import Skills from '../components/Portfolio/Skills';
import Projects from '../components/Portfolio/Projects';
import Experience from '../components/Portfolio/Experience';
import Goals from '../components/Portfolio/Goals';
import Achievements from '../components/Portfolio/Achievements';
import Certifications from '../components/Portfolio/Certifications';
import Contact from '../components/Portfolio/Contact';

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Goals />
      <Achievements />
      <Certifications />
      <Contact />
    </div>
  );
};

export default Home;
