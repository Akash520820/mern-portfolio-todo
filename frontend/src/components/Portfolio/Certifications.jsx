const CERTIFICATIONS = [
  { title: 'API Fundamentals', issuer: 'Postman' },
  { title: 'Full-Stack Web Development', issuer: 'Your Learning Platform' },
  { title: 'Git and GitHub Bootcamp', issuer: "Course Provider" },
];

const Certifications = () => {
  return (
    <section id="certifications" className="section certifications">
      <h2 className="section-title">
        <span className="accent">Certifications</span>
      </h2>
      <div className="container-narrow card certifications__panel">
        <div className="certifications__grid">
          {CERTIFICATIONS.map((c) => (
            <div className="certifications__item" key={c.title}>
              <div className="certifications__icon">🎖</div>
              <div>
                <h4 className="certifications__title">{c.title}</h4>
                <p className="certifications__issuer">{c.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
