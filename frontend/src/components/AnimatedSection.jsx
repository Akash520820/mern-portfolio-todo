import { motion } from 'framer-motion';
import { fadeInUp, revealViewport } from '../utils/motion';

/**
 * Wraps a <section>-level block in a fade-in + slide-up reveal that fires
 * once when it scrolls into view. Keeps every Portfolio section animating
 * the same way instead of each one re-implementing whileInView.
 */
const AnimatedSection = ({ as = 'section', className, id, children, ...rest }) => {
  const MotionTag = motion[as] || motion.section;
  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeInUp}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default AnimatedSection;
