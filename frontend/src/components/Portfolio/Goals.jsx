import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUS_LABEL = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  done: 'Done',
};
const STATUS_CLASS = {
  planned: 'badge-chip',
  'in-progress': 'badge-chip badge-chip--warn',
  done: 'badge-chip badge-chip--accent',
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/goals')
      .then(({ data }) => setGoals(data))
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && goals.length === 0) {
    return null; // keep the section out of the page entirely when there's nothing to show
  }

  return (
    <section id="goals" className="section goals">
      <h2 className="section-title">
        What's <span className="accent">Next</span>
      </h2>
      <div className="container-narrow goals__grid">
        {loading
          ? [0, 1, 2].map((i) => <div className="card goals__skeleton" key={i} />)
          : goals.map((g) => (
              <div className="card goals__card" key={g._id}>
                <div className="goals__card-header">
                  <h3>{g.title}</h3>
                  <span className={STATUS_CLASS[g.status]}>{STATUS_LABEL[g.status]}</span>
                </div>
                {g.description && <p className="goals__card-desc">{g.description}</p>}
                {g.targetDate && (
                  <p className="goals__card-date">
                    Target: {new Date(g.targetDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </p>
                )}
              </div>
            ))}
      </div>
    </section>
  );
};

export default Goals;
