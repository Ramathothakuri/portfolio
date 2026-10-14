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
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#stack" onClick={closeMenu}>Stack</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Let&apos;s talk <span>↗</span></a>
        </nav>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
      </header>

      <main id="main">
        <div className="hero" id="top" aria-hidden="true">
          <div className="hero-image parallax" data-speed="0.12" aria-hidden="true">
            <Image src="/assets/systems-architecture-v2.webp" alt="" fill priority sizes="100vw" />
          </div>
          <div className="hero-shade" aria-hidden="true" />
        </div>

        <section className="experience section-shell" id="experience">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">Professional journey</p>
              <h2 className="section-title">Experience</h2>
            </div>
            <p className="experience-intro">Building and supporting dependable fintech, healthcare, and banking products across the full application stack.</p>
          </div>
          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-card reveal" key={item.company}>
                <div className="experience-meta">
                  <span className="experience-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="timeline-date">{item.date}</span>
                </div>
                <div className="timeline-main"><h3>{item.role}</h3><p>{item.company}</p></div>
                <div className="timeline-detail"><p>{item.detail}</p><span>{item.domain}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto section-shell" id="about">
          <div className="manifesto-copy">
            <p className="eyebrow reveal">About me</p>
            <h2 className="reveal">Full-stack engineering for real-world systems.</h2>
            <div className="manifesto-columns reveal">
              <p>I&apos;m Ramakrishna, a Full Stack Developer with 8+ years of experience turning complex business workflows into clear, reliable web applications. My core stack is Java, Spring Boot, React, and TypeScript, with experience across fintech, banking, and healthcare.</p>
              <p>I build across the full application from accessible interfaces and secure APIs to database performance and AWS deployments. My work includes financial transaction platforms, payment systems, and healthcare integrations where accuracy, security, and reliability matter every day.</p>
              <p>I take ownership from design through production, work closely with product and engineering teams, and mentor developers along the way. I focus on clean architecture, thoughtful user experiences, and software that performs under real world demands.</p>
            </div>
            <div className="profile-tags reveal" aria-label="Core capabilities">
              <span>Java &amp; Spring</span>
              <span>React &amp; TypeScript</span>
              <span>AWS &amp; Kubernetes</span>
              <span>PostgreSQL &amp; messaging</span>
              <span>Security &amp; APIs</span>
              <span>Testing &amp; observability</span>
            </div>
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

        <section className="education" id="education">
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

      <footer><span>© {new Date().getFullYear()} Ramakrishna T</span><span>Designed around clarity, resilience &amp; motion.</span><div className="footer-links"><a href="/Ramakrishna_T_Resume.docx" download>Download résumé ↓</a><a href="https://github.com/Ramathothakuri" target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">Back to top ↑</a></div></footer>
    </>
  );
}
