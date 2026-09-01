import { useEffect, useState } from 'react';
import api from '../../services/api';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/certifications')
      .then(({ data }) => setCerts(data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && certs.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="section certifications">
      <h2 className="section-title">
        <span className="accent">Certifications</span>
      </h2>
      <div className="container-narrow card certifications__panel">
        {loading ? (
          <p className="admin-list__empty">Loading…</p>
        ) : (
          <div className="certifications__grid">
            {certs.map((c) => {
              const content = (
                <>
                  <div className="certifications__icon">🎖</div>
                  <div>
                    <h4 className="certifications__title">{c.title}</h4>
                    <p className="certifications__issuer">
                      {c.issuer}
                      {c.date ? ` · ${c.date}` : ''}
                    </p>
                  </div>
                </>
              );
              return c.url ? (
                <a
                  className="certifications__item"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={c._id}
                >
                  {content}
                </a>
              ) : (
                <div className="certifications__item" key={c._id}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
