"use client";

import { useEffect, useRef, useState } from "react";
import SystemField from "./system-field";

const techGroups = [
  {
    title: "Languages & formats",
    items: ["Java", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3", "JSON", "XML", "YAML", "OpenAPI"],
  },
  {
    title: "Application layer",
    items: ["Spring Boot", "Spring WebFlux", "Spring MVC", "Spring Data JPA", "R2DBC", "Hibernate", "Spring Security", "WebClient", "REST APIs", "Microservices", "React", "Redux Toolkit", "React Query", "React Router", "Material UI", "Tailwind CSS"],
  },
  {
    title: "Data & integration",
    items: ["PostgreSQL", "MySQL", "AWS RDS", "Redis", "Amazon ElastiCache", "Amazon SQS", "Amazon SNS", "Apache Kafka", "RabbitMQ", "FHIR R4", "HL7 v2"],
  },
  {
    title: "Cloud, security & delivery",
    items: ["AWS EKS", "Amazon CloudWatch", "AWS IAM", "AWS Secrets Manager", "Docker", "Kubernetes", "Terraform", "OAuth 2.0", "OpenID Connect", "JWT", "Jenkins", "Git", "Bitbucket"],
  },
  {
    title: "Quality & observability",
    items: ["JUnit 5", "Mockito", "Spring Boot Test", "WebTestClient", "Testcontainers", "Jest", "React Testing Library", "Cypress", "Postman", "Micrometer", "Splunk", "Prometheus", "Grafana"],
  },
];

const experience = [
  {
    date: "2024 — Present",
    role: "Senior Full Stack Developer",
    company: "FIS · Charleston, South Carolina",
    detail: "Building transaction and investigation tools with distributed processing, secure integrations, and AWS.",
    domain: "Fintech",
  },
  {
    date: "2022 — 2024",
    role: "Full Stack Developer",
    company: "Centene Corporation · Clayton, Missouri",
    detail: "Built healthcare ordering and payment workflows using FHIR R4 and HL7, with careful handling of protected data.",
    domain: "Healthcare",
  },
  {
    date: "2018 — 2021",
    role: "Java Full Stack Developer",
    company: "Coforge · Hyderabad, India",
    detail: "Worked on banking systems for customer service, payments, and enterprise integrations.",
    domain: "Banking",
  },
];

const sectionLinks = [
  ["Intro", "#top"],
  ["Experience", "#experience"],
  ["Stack", "#stack"],
  ["Education", "#education"],
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
            <h1 className="reveal">I&apos;m Ramakrishna,<br /><em>a full-stack developer.</em></h1>
            <div className="hero-intro reveal">
              <p>I&apos;ve spent more than eight years building software for fintech, banking, and healthcare. I mostly work with Java, Spring Boot, React, and TypeScript.</p>
              <p>My work covers interfaces, APIs, databases, and AWS deployments.</p>
              <p>I like straightforward code, practical decisions, and staying involved after a product goes live.</p>
            </div>
            <div className="hero-actions reveal">
              <a className="paper-button paper-button-dark" href="#experience">Explore experience <span>↓</span></a>
              <a className="paper-button" href="#contact">Start a conversation <span>↗</span></a>
            </div>
          </div>

          <div className="hero-art reveal" id="sculpture" aria-label="Animated folded-paper sculpture">
            <SystemField />
          </div>
        </section>

        <section className="experience section-shell" id="experience">
          <div className="section-heading reveal">
            <h2>Experience</h2>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-entry reveal" key={item.company}>
                <div className="entry-date">{item.date}</div>
                <div className="entry-role"><h3>{item.role}</h3><p>{item.company}</p></div>
                <div className="entry-detail"><p>{item.detail}</p><span>{item.domain}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="stack section-shell" id="stack">
          <div className="section-heading reveal">
            <h2>Tech stack</h2>
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
