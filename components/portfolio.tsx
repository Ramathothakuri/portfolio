"use client";

import { useEffect, useRef, useState } from "react";
import SystemField from "./system-field";

const coreSkills = [
  "Java 21 / 17",
  "Spring Boot",
  "Spring WebFlux",
  "React",
  "TypeScript",
  "PostgreSQL",
  "AWS",
  "Docker & Kubernetes",
];

const techGroups = [
  {
    title: "Backend",
    items: ["Spring MVC", "Spring Data", "JPA", "R2DBC", "Spring Security", "WebClient", "REST", "OpenAPI"],
  },
  {
    title: "Data & messaging",
    items: ["AWS RDS", "Redis", "ElastiCache", "Amazon SQS", "Amazon SNS", "Kafka", "RabbitMQ", "FHIR R4", "HL7 v2"],
  },
  {
    title: "Cloud & delivery",
    items: ["Amazon EKS", "Terraform", "Jenkins", "Git", "CloudWatch", "OAuth 2.0", "OpenID Connect", "JWT"],
  },
  {
    title: "Quality & operations",
    items: ["JUnit 5", "Mockito", "Testcontainers", "Jest", "React Testing Library", "Cypress", "Micrometer", "Splunk", "Prometheus", "Grafana"],
  },
];

const caseStudies = [
  {
    domain: "Fintech · FIS",
    title: "Transaction investigation and reconciliation",
    summary: "One workspace for operations teams to search financial activity, review exceptions, reconcile records, and resolve cases.",
    problem: "High-volume searches, several downstream services, and permission-sensitive actions made investigation work slow and difficult to trace.",
    build: "Reactive Java 21 services with Spring Boot and WebFlux, paired with React screens for filters, drill-down details, bulk actions, and status history.",
    decisions: [
      "Used keyset pagination and targeted PostgreSQL indexes as result sets grew.",
      "Added correlation IDs, idempotency keys, retries, and dead-letter queues to SQS and SNS flows.",
      "Matched OAuth, OpenID Connect, and JWT roles across both APIs and the interface.",
    ],
    flow: ["Search", "Review exceptions", "Reconcile", "Resolve"],
    tools: ["Java 21", "Spring WebFlux", "React 18", "PostgreSQL", "SQS / SNS", "Amazon EKS"],
  },
  {
    domain: "Healthcare · Centene",
    title: "Provider ordering and patient payments",
    summary: "A full-stack module for provider staff to create and track PCIT orders while patients move through a guided payment flow.",
    problem: "The workflow needed to fit an existing clinical portal, exchange FHIR and HL7 data, and coordinate payments without storing card data.",
    build: "Java 17 and WebFlux APIs for orders, validation, pricing, status, and payments, with React and TypeScript pages for provider and patient workflows.",
    decisions: [
      "Mapped clinical data to FHIR R4 resources and validated HL7 ADT and ORM messages.",
      "Kept the existing login and patient context through shared authentication and deep links.",
      "Used tokenized payment references, PostgreSQL transactions, and idempotent queue consumers.",
    ],
    flow: ["Create order", "Validate data", "Take payment", "Track status"],
    tools: ["Java 17", "Spring Boot", "React", "FHIR R4", "HL7 v2", "PostgreSQL"],
  },
];

const experience = [
  {
    date: "2024 — Present",
    role: "Senior Full Stack Developer",
    company: "FIS · Charleston, South Carolina",
    contributions: [
      "Turn broad operations requests into transaction search, exception review, reconciliation, and case-management workflows.",
      "Build WebFlux APIs with controlled retries and React screens with filters, drill-down details, bulk actions, and permission-aware controls.",
      "Tune PostgreSQL searches with targeted indexes and keyset pagination; design SQS and SNS flows for safe replay and recovery.",
    ],
  },
  {
    date: "2022 — 2024",
    role: "Full Stack Developer",
    company: "Centene Corporation · Clayton, Missouri",
    contributions: [
      "Integrated provider ordering and patient payments into an existing clinical portal with shared authentication and patient context.",
      "Built Java 17 APIs and accessible React forms for order creation, validation, payment, receipts, and status history.",
      "Mapped FHIR R4 resources, processed HL7 updates, and used tokenized payments with transactional audit data in PostgreSQL.",
    ],
  },
  {
    date: "2018 — 2021",
    role: "Java Full Stack Developer",
    company: "Coforge · Hyderabad, India",
    contributions: [
      "Moved account servicing and payment capabilities into Java and React modules while legacy platforms stayed operational.",
      "Built Spring services, reusable TypeScript interfaces, and adapters that normalized inconsistent legacy data into stable REST contracts.",
      "Improved SQL and pagination, added Redis caching, and handled payment events with Kafka and RabbitMQ retry paths.",
    ],
  },
];

const sectionLinks = [
  ["Intro", "#top"],
  ["Work", "#work"],
  ["Experience", "#experience"],
  ["Stack", "#stack"],
] as const;

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

    document.querySelectorAll<HTMLElement>(".reveal").forEach((element, index) => {
      element.style.setProperty("--delay", `${Math.min(index % 3, 2) * 80}ms`);
      revealObserver.observe(element);
    });

    let ticking = false;
    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);
      headerRef.current?.classList.toggle("is-scrolled", scrollY > 24);
      if (!reducedMotion) document.documentElement.style.setProperty("--paper-shift", `${Math.min(scrollY * 0.018, 26)}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateScroll);
    };

    addEventListener("scroll", onScroll, { passive: true });
    updateScroll();
    return () => {
      revealObserver.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="paper-grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>

      <header ref={headerRef} className="site-header">
        <a className="brand" href="#top" aria-label="Ramakrishna T — home" onClick={closeMenu}>
          <span className="brand-seal">RT</span>
          <span className="brand-name">Ramakrishna T<small>Full Stack Developer</small></span>
        </a>
        <nav aria-label="Primary navigation">
          {sectionLinks.map(([label, href]) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Contact <span>↘</span></a>
        </nav>
        <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
      </header>

      <main id="main">
        <section className="hero section-shell" id="top">
          <div className="hero-copy">
            <h1 className="reveal">Hello, I&apos;m Ramakrishna.<br /><em>Full-stack developer.</em></h1>
            <div className="hero-intro reveal">
              <p>I&apos;m Ramakrishna, a Full Stack Developer with 8+ years of experience building software for fintech, banking, and healthcare. I connect the pieces that make an application work from React and TypeScript interfaces to Java services, databases, and cloud infrastructure.</p>
              <p>I enjoy making complicated workflows easier to use and systems easier to maintain.</p>
              <p>My work starts with understanding the problem and continues through design, development, and production support. Along the way, I collaborate closely with product teams, review technical decisions, and mentor developers.</p>
              <p>I care about the details: clear interfaces, secure APIs, reliable processing, and code the next developer can understand.</p>
            </div>
            <div className="hero-actions reveal">
              <a className="paper-button paper-button-dark" href="#work">View selected work <span>↓</span></a>
              <a className="paper-button resume-button" href="/Ramakrishna_T_Resume.docx" download>Download résumé <span>↓</span></a>
            </div>
          </div>

          <div className="hero-art reveal" id="sculpture" aria-label="Animated folded-paper sculpture">
            <SystemField />
          </div>
        </section>

        <section className="work section-shell" id="work">
          <div className="section-heading reveal">
            <h2>Selected work</h2>
          </div>
          <div className="case-study-list">
            {caseStudies.map((study) => (
              <article className="case-study reveal" key={study.title}>
                <header>
                  <p>{study.domain}</p>
                  <h3>{study.title}</h3>
                  <strong>{study.summary}</strong>
                </header>
                <div className="case-study-body">
                  <div><span>Problem</span><p>{study.problem}</p></div>
                  <div><span>What I built</span><p>{study.build}</p></div>
                  <div><span>Technical decisions</span><ul>{study.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></div>
                </div>
                <div className="case-flow" aria-label={`${study.title} workflow`}>
                  {study.flow.map((step) => <span key={step}>{step}</span>)}
                </div>
                <div className="case-tools">{study.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="experience section-shell" id="experience">
          <div className="section-heading reveal">
            <h2>Experience</h2>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-entry reveal" key={item.company}>
                <header className="experience-lead">
                  <div className="entry-date">{item.date}</div>
                  <div className="entry-role"><h3>{item.role}</h3><p>{item.company}</p></div>
                </header>
                <ul className="entry-contributions">
                  {item.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="stack section-shell" id="stack">
          <div className="section-heading reveal">
            <h2>Tech stack</h2>
          </div>
          <div className="core-skills reveal" aria-label="Core skills">
            <p>Core skills</p>
            <div>{coreSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </div>
          <div className="stack-grid" aria-label="Technology stack">
            {techGroups.map((group) => (
              <article className="stack-card reveal" key={group.title}>
                <header><h3>{group.title}</h3></header>
                <div className="tech-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="education section-shell" id="education">
          <div className="section-heading reveal">
            <h2>Education</h2>
          </div>
          <div className="education-grid">
            <article className="degree degree-primary reveal"><div className="degree-mark">M</div><div><span>Master&apos;s degree</span><h3>Computer Science</h3><p>Campbellsville University · Kentucky, USA</p></div><strong>GPA 3.9 / 4.0</strong></article>
            <article className="degree reveal"><div className="degree-mark">B</div><div><span>Bachelor&apos;s degree</span><h3>Computer Science</h3><p>Anurag Engineering College · India</p></div><strong>GPA 7.2 / 10</strong></article>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner section-shell">
            <p className="eyebrow reveal">Contact</p>
            <h2 className="reveal">Want to work together?<br /><em>Send me a note.</em></h2>
            <div className="contact-actions reveal">
              <a className="contact-email" href="mailto:rthothakuri@gmail.com">rthothakuri@gmail.com <span>↗</span></a>
              <a href="tel:+19453331677">+1 945 333 1677</a>
              <a href="https://www.linkedin.com/search/results/people/?keywords=Ramakrishna%20T%20Full%20Stack%20Developer%20FIS" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
              <a href="https://github.com/Ramathothakuri" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Ramakrishna T</span>
        <div><a href="/Ramakrishna_T_Resume.docx" download>Download résumé ↓</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </>
  );
}
