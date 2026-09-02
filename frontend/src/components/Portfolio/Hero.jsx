import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, buttonBounce } from '../../utils/motion';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Akash520820', icon: 'M12 .5C5.73.5.98 5.24.98 11.5c0 4.98 3.23 9.2 7.72 10.69.56.1.77-.24.77-.54 0-.27-.01-1-.01-1.96-3.14.68-3.8-1.5-3.8-1.5-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.65 0c2.15-1.46 3.1-1.16 3.1-1.16.6 1.54.23 2.68.11 2.96.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.42.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .3.2.65.78.54A11.02 11.02 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM.5 8.98h4.96V23H.5V8.98ZM8.5 8.98h4.76v1.93h.07c.66-1.25 2.28-2.57 4.7-2.57 5.03 0 5.96 3.31 5.96 7.62V23h-4.96v-6.35c0-1.52-.03-3.47-2.12-3.47-2.12 0-2.44 1.66-2.44 3.36V23H8.5V8.98Z' },
];
const EMAIL_ICON = 'M2 4h20v16H2V4Zm2 2v.01L12 12l8-5.99V6H4Zm16 2.24-7.4 5.55a1 1 0 0 1-1.2 0L4 8.24V18h16V8.24Z';

const Hero = () => {
  // HashRouter treats the whole URL hash as a route path, so raw
  // href="#contact" anchors break navigation (no route matches "contact").
  // Scroll to the section directly instead, entirely bypassing the router.
  const scrollToContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <motion.div
        className="hero__inner"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.12, 0.1)}
      >
        <div className="hero__text">
          <motion.p variants={fadeInUp} className="eyebrow">
            Hey, I'm Akash Chakraborty
          </motion.p>
          <motion.h1 variants={fadeInUp} className="hero__headline">
            Build. <span className="hero__headline-accent">Ship.</span>
          </motion.h1>
          <motion.h2 variants={fadeInUp} className="hero__subhead">
            Full-Stack Engineer across MERN, Cloud &amp; AI
          </motion.h2>
          <motion.p variants={fadeInUp} className="hero__desc">
            I build practical, high-impact products end to end — from responsive React
            frontends to secure Express APIs and MongoDB data layers. This portfolio and
            the private todo app powering it are both built on the same MERN stack.
          </motion.p>
          <motion.div variants={fadeInUp} className="hero__ctas">
            <motion.button
              type="button"
              onClick={scrollToContact}
              className="btn-glow"
              {...buttonBounce}
            >
              Get in Touch →
            </motion.button>
          </motion.div>
          <motion.div variants={fadeInUp} className="hero__socials">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="hero__social"
                target="_blank"
                rel="noreferrer"
                {...buttonBounce}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d={s.icon} />
                </svg>
              </motion.a>
            ))}
            {/* Email icon scrolls to the Contact section (like "Get in Touch")
                instead of relying on mailto:, since Contact already shows the
                email/phone/location and a working message form — a more
                complete option than a mailto link some visitors can't use. */}
            <motion.button
              type="button"
              onClick={scrollToContact}
              aria-label="Email"
              className="hero__social"
              {...buttonBounce}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d={EMAIL_ICON} />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="hero__portrait-wrap"
          aria-hidden="true"
          variants={fadeInUp}
          animate={{ y: [0, -10, 0] }}
          transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <div className="hero__portrait">
            <div className="hero__portrait-glyph">{'</>'}</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
