import { Link } from "react-router-dom";

const previewJobs = [
  {
    title: "Frontend Engineer",
    company: "Northwind Labs",
    location: "Remote",
    status: "Interview",
    date: "Sep 18",
  },
  {
    title: "Software Engineer II",
    company: "Acme Cloud",
    location: "Austin, TX",
    status: "Applied",
    date: "Sep 16",
  },
  {
    title: "Full Stack Developer",
    company: "Brightline",
    location: "New York, NY",
    status: "Offer",
    date: "Sep 12",
  },
  {
    title: "React Developer",
    company: "Contoso Health",
    location: "Seattle, WA",
    status: "Rejected",
    date: "Sep 09",
  },
  {
    title: "UI Engineer",
    company: "Lumen Studio",
    location: "Remote",
    status: "Applied",
    date: "Sep 05",
  },
];

const previewStats = [
  { label: "Total", value: 24 },
  { label: "Applied", value: 15 },
  { label: "Interview", value: 6 },
  { label: "Offer", value: 1 },
];

const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const features = [
  {
    title: "Track Applications",
    text: "Keep all your job applications organized in one dashboard.",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 10v10" />
      </Icon>
    ),
  },
  {
    title: "Save Jobs from Your Browser",
    text: "Use the Chrome extension to capture job details while browsing.",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </Icon>
    ),
  },
  {
    title: "Automatic Job Extraction",
    text: "Extract important job information without manually entering everything.",
    icon: (
      <Icon>
        <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M8 9h8M8 12h8M8 15h5" />
      </Icon>
    ),
  },
  {
    title: "Duplicate Detection",
    text: "Avoid accidentally saving the same application more than once.",
    icon: (
      <Icon>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </Icon>
    ),
  },
  {
    title: "Track Your Progress",
    text: "Keep application statuses organized as you move through the hiring process.",
    icon: (
      <Icon>
        <path d="M4 19h16M7 16v-4M12 16V8M17 16v-7" />
      </Icon>
    ),
  },
  {
    title: "Manual Entry",
    text: "Add applications manually whenever you need to.",
    icon: (
      <Icon>
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </Icon>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Find a job",
    text: "Browse job opportunities on your favorite job websites.",
  },
  {
    number: "02",
    title: "Save it with ATrackie",
    text: "Use the Chrome extension to capture the job details and save the application.",
  },
  {
    number: "03",
    title: "Track your progress",
    text: "Manage your applications and update their status from your ATrackie dashboard.",
  },
];

function scrollToSection(event, id) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
  window.history.replaceState(null, "", `#${id}`);
}

function Brand() {
  return (
    <span className="lp-brand">
      <span className="brand-mark" aria-hidden="true">
        AT
      </span>
      <span>ATrackie</span>
    </span>
  );
}

function DashboardPreview() {
  return (
    <div
      className="lp-preview"
      role="img"
      aria-label="Preview of the ATrackie dashboard showing application counts and a list of tracked jobs with their statuses"
    >
      <div className="lp-preview-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <div className="lp-preview-url">atrackie.app/jobs</div>
      </div>
      <div className="lp-preview-body" aria-hidden="true">
        <div className="lp-preview-header">
          <Brand />
          <span className="lp-preview-avatar">VS</span>
        </div>
        <div className="lp-preview-title">
          <p className="lp-eyebrow">Your Career</p>
          <strong>Applications</strong>
        </div>
        <div className="lp-preview-stats">
          {previewStats.map((stat) => (
            <div key={stat.label} className="lp-preview-stat">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
        <div className="lp-preview-search">
          Search by title, company, or location
        </div>
        <ul className="lp-preview-list">
          {previewJobs.map((job) => (
            <li key={job.title} className="lp-preview-row">
              <div className="lp-preview-job">
                <strong>{job.title}</strong>
                <span>
                  {job.company} · {job.location}
                </span>
              </div>
              <span
                className={`lp-status lp-status-${job.status.toLowerCase()}`}
              >
                <span className="lp-status-dot" />
                {job.status}
              </span>
              <span className="lp-preview-date">{job.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>

      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <Link to="/" className="lp-brand-link" aria-label="ATrackie home">
            <Brand />
          </Link>
          <nav className="lp-nav-links" aria-label="Primary">
            <a href="#features" onClick={(e) => scrollToSection(e, "features")}>
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
            >
              How it works
            </a>
          </nav>
          <div className="lp-nav-actions">
            <a
              className="lp-btn lp-btn-secondary"
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              Download Chrome Extension
            </a>
            <Link to="/login" className="lp-btn lp-btn-ghost">
              Sign in
            </Link>
            <Link to="/signup" className="lp-btn lp-btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="lp-opening-message" aria-live="polite">
        <span className="lp-opening-dot" aria-hidden="true" />
        <span>
          Download the ATrackie Chrome Extension before you sign up, and start
          saving jobs while you browse.
        </span>
      </div>

      <main id="main"></main>

      <main id="main">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-copy">
              <p className="lp-pill">
                <span className="lp-pill-dot" aria-hidden="true" />
                Job application tracker + Chrome extension
              </p>
              <h1 id="hero-title">
                Track every application.
                <span>Stay on top of your job search.</span>
              </h1>
              <p className="lp-lead">
                ATrackie helps you save job opportunities, organize your
                applications, and keep track of your progress — all in one
                place.
              </p>
              <div className="lp-cta-row">
                <Link to="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="lp-btn lp-btn-secondary lp-btn-lg">
                  Sign in
                </Link>
              </div>
              <p className="lp-hero-note">
                Save jobs directly from your browser with the ATrackie Chrome
                extension.
              </p>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="lp-section" aria-labelledby="extension-title">
          <div className="lp-container">
            <div className="lp-extension">
              <div className="lp-extension-copy">
                <p className="lp-eyebrow">Chrome extension</p>
                <h2 id="extension-title">Save jobs while you browse</h2>
                <p>
                  The ATrackie Chrome extension captures job information
                  directly from supported job pages — title, company, location,
                  and details — and sends it straight to your ATrackie
                  dashboard. Already saved that job? ATrackie lets you know.
                </p>
                <a
                  className="lp-btn lp-btn-primary lp-btn-lg"
                  href="#"
                  onClick={(event) => event.preventDefault()}
                >
                  Download Chrome Extension
                </a>
              </div>
              <div
                className="lp-popup"
                role="img"
                aria-label="Preview of the ATrackie extension popup with an extracted job ready to save"
              >
                <div aria-hidden="true">
                  <div className="lp-popup-head">
                    <Brand />
                    <span className="lp-popup-tag">Job detected</span>
                  </div>
                  <dl className="lp-popup-details">
                    <div>
                      <dt>Title</dt>
                      <dd>Frontend Engineer</dd>
                    </div>
                    <div>
                      <dt>Company</dt>
                      <dd>Northwind Labs</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>Remote</dd>
                    </div>
                  </dl>
                  <div className="lp-popup-btn">Save application</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="lp-section"
          aria-labelledby="features-title"
        >
          <div className="lp-container">
            <div className="lp-section-head">
              <p className="lp-eyebrow">Features</p>
              <h2 id="features-title">Everything you need to stay organized</h2>
            </div>
            <ul className="lp-feature-grid">
              {features.map((feature) => (
                <li key={feature.title} className="lp-card lp-feature">
                  <span className="lp-feature-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          className="lp-section lp-section-alt"
          aria-labelledby="how-title"
        >
          <div className="lp-container">
            <div className="lp-section-head">
              <p className="lp-eyebrow">How it works</p>
              <h2 id="how-title">From job discovery to application tracking</h2>
            </div>
            <ol className="lp-steps">
              {steps.map((step) => (
                <li key={step.number} className="lp-step">
                  <span className="lp-step-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3>
                    <span className="lp-visually-hidden">
                      Step {Number(step.number)}:{" "}
                    </span>
                    {step.title}
                  </h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lp-section lp-final" aria-labelledby="final-title">
          <div className="lp-container lp-final-inner">
            <h2 id="final-title">Keep your job search organized.</h2>
            <p>
              Start tracking your applications with ATrackie and keep everything
              in one place.
            </p>
            <div className="lp-cta-row lp-cta-center">
              <Link to="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
                Create your account
              </Link>
              <Link to="/login" className="lp-btn lp-btn-secondary lp-btn-lg">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div>
            <Brand />
            <p>Your job application tracker.</p>
          </div>
          <nav className="lp-footer-links" aria-label="Footer">
            <a href="#features" onClick={(e) => scrollToSection(e, "features")}>
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
            >
              How it works
            </a>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Get Started</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
