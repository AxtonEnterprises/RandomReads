export default function About() {
  return (
    <section className="stack-md">
      <div className="hero-card small">
        <p className="eyebrow">About the project</p>
        <h1>Random Reads is the discovery layer for The Literature Foundation.</h1>
        <p>
          This starter app uses React, Vite, local storage, Gutendex public domain book data, and PWA support. Firebase can be added later for user accounts, cloud journals, proof-of-reading, and community features.
        </p>
      </div>
      <div className="panel">
        <h2>Build path</h2>
        <ol className="clean-list numbered">
          <li>Get the reader and random/search flow working.</li>
          <li>Add Firebase Authentication and Firestore journals.</li>
          <li>Add offline book caching and reading progress.</li>
          <li>Add The Literature Foundation branding, sponsorships, and proof-of-reading.</li>
        </ol>
      </div>
    </section>
  );
}
