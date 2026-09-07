import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AnimatedSection from '../AnimatedSection';
import { fadeInUp, staggerContainer, hoverBounce, buttonBounce, revealViewport } from '../../utils/motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/profile')
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/messages', form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to send — please try again.');
    }
  };

  return (
    <AnimatedSection id="contact" className="section contact">
      <h2 className="section-title">
        Say Hi, <span className="accent">Don't Be Shy</span>
      </h2>

      <motion.div
        className="container-narrow contact__grid"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={fadeInUp} className="contact__info">
          <motion.div className="card contact__info-card" whileHover={hoverBounce.whileHover}>
            <span className="contact__info-icon">✉</span>
            <div>
              <h4>Email</h4>
              <p>{profile?.email || 'you@example.com'}</p>
            </div>
          </motion.div>
          <motion.div className="card contact__info-card" whileHover={hoverBounce.whileHover}>
            <span className="contact__info-icon">☎</span>
            <div>
              <h4>Phone</h4>
              <p>{profile?.phone || '+1 234 567 890'}</p>
            </div>
          </motion.div>
          <motion.div className="card contact__info-card" whileHover={hoverBounce.whileHover}>
            <span className="contact__info-icon">📍</span>
            <div>
              <h4>Location</h4>
              <p>{profile?.location || 'Your City, Country'}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.form variants={fadeInUp} className="card contact__form" onSubmit={handleSubmit}>
          {status === 'sent' && <div className="contact__success">Thanks — your message has been sent!</div>}
          {status === 'error' && <div className="auth-card__error">{error}</div>}
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
            </div>
            <div className="contact__field">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="contact__field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can I help you?" />
          </div>
          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Your message here..."
              required
            />
          </div>
          <motion.button
            type="submit"
            className="btn-glow contact__submit"
            disabled={status === 'sending'}
            {...buttonBounce}
          >
            {status === 'sending' ? 'Sending…' : 'Send Message →'}
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatedSection>
  );
};

export default Contact;