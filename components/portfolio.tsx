"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SystemField from "./system-field";

const techColumns = [
  {
    id: "A",
    title: "Languages & formats",
    items: ["Java 21 / 17 / 11 / 8", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3", "JSON", "XML", "YAML", "OpenAPI"],
  },
  {
    id: "B",
    title: "Application layer",
    items: ["Spring Boot", "Spring WebFlux", "Spring MVC", "Spring Data JPA / R2DBC", "Hibernate", "Spring Security", "WebClient", "REST APIs", "Microservices", "React / React 18", "Redux / Redux Toolkit", "React Query", "React Router", "React Hooks", "Material UI", "Tailwind CSS", "Accessible forms", "Responsive UI"],
  },
  {
    id: "C",
    title: "Data & integration",
    items: ["PostgreSQL", "MySQL", "AWS RDS", "Redis", "Amazon ElastiCache", "Amazon SQS", "Amazon SNS", "Kafka", "RabbitMQ", "FHIR R4", "HL7 v2", "FHIR Bundles", "Patient", "Practitioner", "ServiceRequest", "Coverage", "Organization", "ADT / ORM workflows", "Indexing & query tuning", "Caching"],
  },
  {
    id: "D",
    title: "Cloud, security & delivery",
    items: ["AWS EKS", "CloudWatch", "AWS IAM", "Secrets Manager", "Docker", "Kubernetes", "Terraform", "OAuth 2.0", "OpenID Connect", "JWT", "CI / CD", "Jenkins", "Git", "Bitbucket", "Jira", "Confluence", "Secure SDLC"],
  },
  {
    id: "E",
    title: "Quality & observability",
    items: ["JUnit 5", "Mockito", "Spring Boot Test", "WebTestClient", "Testcontainers", "Jest", "React Testing Library", "Cypress", "Postman", "Micrometer", "Splunk", "Prometheus", "Grafana", "Structured logging", "Metrics & tracing", "Health probes"],
  },
];

const experience = [
  { date: "2024 — Now", role: "Senior Full Stack Developer", company: "FIS · Charleston, South Carolina", detail: "Transaction operations, investigation workflows, distributed processing, and cloud-native delivery.", domain: "Fintech" },
  { date: "2022 — 2024", role: "Full Stack Developer", company: "Centene Corporation · Clayton, Missouri", detail: "Healthcare ordering, payments, FHIR R4, HL7 integrations, and protected-data workflows.", domain: "Healthcare" },
  { date: "2018 — 2021", role: "Java Full Stack Developer", company: "Coforge · Hyderabad, India", detail: "Banking modernization, customer servicing, payment flows, and legacy-system integration.", domain: "Banking" },
];

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
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

    const revealNodes = document.querySelectorAll<HTMLElement>(".reveal");
    revealNodes.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(element);
    });

    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;
      headerRef.current?.classList.toggle("scrolled", scrollY > 36);

      if (!reducedMotion) {
        document.querySelectorAll<HTMLElement>(".parallax").forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom < -240 || rect.top > innerHeight + 240) return;
          const image = element.querySelector<HTMLElement>("img");
          if (!image) return;
          const speed = Number(element.dataset.speed || 0.07);
          const distance = rect.top + rect.height / 2 - innerHeight / 2;
          image.style.transform = `translate3d(0, ${-distance * speed}px, 0) scale(1.035)`;
        });
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      revealObserver.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SystemField />
      <div className="grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>

      <header ref={headerRef} className="site-header">
        <a className="brand" href="#top" aria-label="Ramakrishna T — home" onClick={closeMenu}>
          <span className="brand-mark">RT</span>
          <span className="brand-copy">Ramakrishna T<small>Full Stack Developer</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#stack" onClick={closeMenu}>Stack</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Let&apos;s talk <span>↗</span></a>
        </nav>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-image parallax" data-speed="0.12" aria-hidden="true">
            <Image src="/assets/systems-architecture-v2.webp" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", height: "114%" }} />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-kicker reveal"><span className="status-dot" />Senior full-stack engineer · Charleston, SC</div>
            <h1 className="reveal"><span>Systems that</span><span className="outline"><em>hold up</em></span><span>in the real world.</span></h1>
            <div className="hero-bottom">
              <p className="hero-intro reveal">I build secure, observable enterprise applications—from reactive Java services to accessible React workflows—across fintech, healthcare, and banking.</p>
              <div className="hero-actions reveal">
                <a className="button button-primary" href="#experience">View experience <span>↓</span></a>
                <a className="button button-ghost" href="/Ramakrishna_T_Resume.docx" download>Download résumé <span>↘</span></a>
              </div>
            </div>
            <div className="hero-stats reveal" aria-label="Career highlights">
              <div><strong>8+</strong><span>Years delivering<br />enterprise software</span></div>
              <div><strong>3</strong><span>Regulated<br />business domains</span></div>
              <div><strong>21</strong><span>Modern Java<br />in production</span></div>
            </div>
          </div>
          <div className="canvas-caption" aria-hidden="true"><span>Live system field</span><i /><span>Three.js · 60 FPS</span></div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll to inspect</span><i /></div>
        </section>

        <section className="manifesto section-shell" id="about">
          <div className="section-label reveal"><span>01</span> Profile</div>
          <div className="manifesto-copy">
            <p className="eyebrow reveal">Engineering from request to release</p>
            <h2 className="reveal">I turn complicated operational needs into software people can trust.</h2>
            <div className="manifesto-columns reveal">
              <p>My work spans technical design, API and data modeling, implementation, testing, release, and production support. I care equally about the workflow on screen and the system behavior beneath it.</p>
              <p>That means secure boundaries, explicit failure states, reliable event processing, intentional data access, and observability that helps teams understand what the software is doing.</p>
            </div>
          </div>
        </section>

        <section className="experience section-shell" id="experience">
          <div className="section-heading reveal"><h2 className="section-title">Experience</h2></div>
          <div className="timeline">
            {experience.map((item) => <article className="timeline-row reveal" key={item.company}><div className="timeline-date">{item.date}</div><div className="timeline-dot" /><div className="timeline-main"><h3>{item.role}</h3><p>{item.company}</p></div><div className="timeline-detail"><p>{item.detail}</p><span>{item.domain}</span></div></article>)}
          </div>
        </section>

        <section className="stack" id="stack">
          <div className="section-shell">
            <div className="stack-heading reveal">
              <h2>Tech stack</h2>
            </div>
            <div className="stack-grid reveal" aria-label="Technology stack">
              {techColumns.map((group) => (
                <article className="stack-group" key={group.id}>
                  <header>
                    <span className="group-index">{group.id}</span>
                    <h3>{group.title}</h3>
                    <span className="group-count">{group.items.length}</span>
                  </header>
                  <div className="stack-list">
                    {group.items.map((item) => <span className="tech-chip" key={item}>{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="principles">
          <div className="section-shell">
            <div className="principles-heading reveal"><h2 className="section-title">Working principles</h2></div>
            <div className="principles-grid reveal"><article><span>01</span><h3>Make failure explicit.</h3><p>Timeouts, retries, validation, dead-letter handling, and actionable error states belong in the design—not the cleanup.</p></article><article><span>02</span><h3>Observe the whole path.</h3><p>Logs, metrics, traces, correlation identifiers, dashboards, and health signals turn production behavior into something teams can reason about.</p></article><article><span>03</span><h3>Fit the platform.</h3><p>Strong solutions respect existing architecture, security boundaries, data ownership, and the way users already complete their work.</p></article></div>
          </div>
        </section>

        <section className="education">
          <div className="section-shell">
            <div className="education-heading reveal"><h2 className="section-title">Education</h2></div>
            <div className="education-grid reveal"><article><span className="degree-level">Master&apos;s degree</span><h3>Computer Science</h3><p>Campbellsville University · Kentucky, USA</p><strong>GPA 3.9 / 4.0</strong></article><article><span className="degree-level">Bachelor&apos;s degree</span><h3>Computer Science</h3><p>Anurag Engineering College · India</p><strong>GPA 7.2 / 10</strong></article></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-glow" aria-hidden="true" />
          <div className="contact-inner section-shell">
            <div className="contact-avatar reveal" aria-label="Ramakrishna T initials">RT</div>
            <p className="eyebrow reveal">Open to the next meaningful challenge</p>
            <h2 className="reveal">Let’s build software that stays dependable when the stakes are real.</h2>
            <div className="contact-actions reveal"><a className="contact-primary" href="mailto:rthothakuri@gmail.com">rthothakuri@gmail.com <span>↗</span></a><a href="tel:+19453331677">+1 945 333 1677</a><a href="https://www.linkedin.com/search/results/people/?keywords=Ramakrishna%20T%20Full%20Stack%20Developer%20FIS" target="_blank" rel="noreferrer" title="Search LinkedIn for Ramakrishna T — exact profile not verified">LinkedIn search <span>↗</span></a></div>
          </div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} Ramakrishna T</span><span>Designed around clarity, resilience &amp; motion.</span><div className="footer-links"><a href="https://github.com/Ramathothakuri" target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">Back to top ↑</a></div></footer>
    </>
  );
}
