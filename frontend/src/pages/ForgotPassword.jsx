import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      // Backend always returns the same generic message whether or not the
      // email exists/is allowed, on purpose - don't reveal account info here.
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <p className="eyebrow">{'{auth}'}</p>
        <h2 className="auth-card__title">Forgot password</h2>
        {error && <div className="auth-card__error">{error}</div>}
        {message && <div className="auth-card__success">{message}</div>}
        {!message && (
          <form onSubmit={handleSubmit} className="auth-card__form">
            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-glow auth-card__submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link →'}
            </button>
          </form>
        )}
        <p className="auth-card__switch">
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
