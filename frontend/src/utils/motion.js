// Shared Framer Motion variants — keeps animation timing/easing consistent
// across the whole frontend instead of every component inventing its own.
// Respect prefers-reduced-motion by keeping distances small and relying on
// framer-motion's built-in reduced-motion handling via useReducedMotion()
// in components that need it.

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Applied via whileHover on cards / chips for a light tactile "bounce".
export const hoverBounce = {
  whileHover: { y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } },
  whileTap: { scale: 0.97 },
};

// Applied via whileHover on buttons/links for a subtle lift + bounce.
export const buttonBounce = {
  whileHover: { scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 12 } },
  whileTap: { scale: 0.96 },
};

// Default viewport settings for scroll-triggered reveals — fires once,
// a little before the element is fully in view.
export const revealViewport = { once: true, amount: 0.25 };
