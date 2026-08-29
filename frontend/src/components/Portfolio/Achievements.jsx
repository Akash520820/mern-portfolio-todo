const ACHIEVEMENTS = [
  {
    title: 'Winner, Your Hackathon 2025',
    org: 'Hosted by Organization Name',
    period: '2025',
    description: 'Won first place building a project under the AI domain, competing against teams from across the region.',
  },
  {
    title: 'Runner-up, Another Competition',
    org: 'Hosted by Organization Name',
    period: '2024',
    description: 'Placed second among a large field of entrants for a project focused on real-world impact.',
  },
];

const Achievements = () => {
  return (
    <section id="achievements" className="section achievements">
      <h2 className="section-title">
        <span className="accent">Achievements</span>
      </h2>
      <div className="container-narrow timeline">
        {ACHIEVEMENTS.map((a, i) => (
          <div className="timeline__row" key={a.title}>
            <div className="timeline__marker">
              <span className="timeline__dot timeline__dot--warn" />
              {i < ACHIEVEMENTS.length - 1 && <span className="timeline__line" />}
            </div>
            <div className="card timeline__card">
              <div className="timeline__card-icon timeline__card-icon--warn">🏆</div>
              <div>
                <h3 className="timeline__card-title">{a.title}</h3>
                <p className="timeline__card-org">{a.org}</p>
                <p className="timeline__card-desc">{a.description}</p>
                <div className="timeline__card-footer">
                  <span className="badge-chip badge-chip--warn">{a.period}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
