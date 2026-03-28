import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaBars,
  FaBook,
  FaChartBar,
  FaCloud,
  FaCode,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaExternalLinkAlt,
  FaGithub,
  FaGitAlt,
  FaGraduationCap,
  FaHome,
  FaHtml5,
  FaInstagram,
  FaJava,
  FaLinkedin,
  FaMoon,
  FaPaperPlane,
  FaPhone,
  FaPython,
  FaReact,
  FaSun,
  FaTable,
  FaTimes,
  FaUser,
  FaYoutube,
} from "react-icons/fa";
import { SiMysql } from "react-icons/si";

import ErrorBoundary from "./ErrorBoundary";
import TiltedCard from "./TiltedCard";
import VariableProximity from "./VariableProximity";
import projects from "./projects.json";
import pranavPhoto from "./assets/pranav-photo.jpg";
import githubCtaBg from "./assets/image_616736.jpg";
import resumeProjectImage from "./assets/resume.png";
import mentalHealthImage from "./assets/mental_health_sql.jpg";
import documentEditorImage from "./assets/document_editor_ai.jpg";
import "./App.css";

const TypewriterText = ({ text, className = "", speed = 90 }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const characters = Array.from(text);
    if (!characters.length) return undefined;

    const timeoutId = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        setVisibleCount((current) => {
          if (current >= characters.length) {
            window.clearInterval(intervalId);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, 160);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [speed, text]);

  return (
    <span className={className}>
      {Array.from(text).slice(0, visibleCount).join("")}
      <span className="terminal-caret" aria-hidden="true" />
    </span>
  );
};

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];

    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, index) => ({
        characters: splitIntoCharacters(word),
        needsSpace: index !== words.length - 1,
      }));
    }

    if (splitBy === "words") {
      return currentText.split(" ").map((word, index, items) => ({
        characters: [word],
        needsSpace: index !== items.length - 1,
      }));
    }

    if (splitBy === "lines") {
      return currentText.split("\n").map((line, index, items) => ({
        characters: [line],
        needsSpace: index !== items.length - 1,
      }));
    }

    return currentText.split(splitBy).map((part, index, items) => ({
      characters: [part],
      needsSpace: index !== items.length - 1,
    }));
  }, [currentTextIndex, splitBy, texts]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * totalChars);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerDuration, staggerFrom]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;

    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, handleIndexChange, loop, texts.length]);

  const previous = useCallback(() => {
    const previousIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;

    if (previousIndex !== currentTextIndex) {
      handleIndexChange(previousIndex);
    }
  }, [currentTextIndex, handleIndexChange, loop, texts.length]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [currentTextIndex, handleIndexChange, texts.length]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [jumpTo, next, previous, reset]
  );

  useEffect(() => {
    if (!auto) return undefined;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [auto, next, rotationInterval]);

  return (
    <motion.span className={cn("text-rotate", mainClassName)} {...rest} layout transition={transition}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(splitBy === "lines" ? "text-rotate-lines" : "text-rotate")}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, words) => {
            const previousCharsCount = words
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0);
            const totalChars = words.reduce((sum, word) => sum + word.characters.length, 0);

            return (
              <span key={wordIndex} className={cn("text-rotate-word", splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    className={cn("text-rotate-element", elementLevelClassName)}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(previousCharsCount + charIndex, totalChars),
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const githubProjectsRef = useRef(null);
  const contactRef = useRef(null);

  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= 900);

  const menuItems = useMemo(
    () => [
      { id: "home", label: "Home", ref: homeRef, icon: <FaHome /> },
      { id: "about", label: "About Me", ref: aboutRef, icon: <FaUser /> },
      { id: "skills", label: "Skills", ref: skillsRef, icon: <FaCode /> },
      { id: "education", label: "Education", ref: educationRef, icon: <FaGraduationCap /> },
      { id: "projects", label: "My Works", ref: projectsRef, icon: <FaCode /> },
      { id: "github-projects", label: "More Projects", ref: githubProjectsRef, icon: <FaGithub /> },
      { id: "contact", label: "Reach Me", ref: contactRef, icon: <FaPaperPlane /> },
    ],
    []
  );

  const captions = useMemo(
    () => ["Emerging AIML Engineer", "AI Enthusiast", "Innovator in Tech"],
    []
  );

  const skillGroups = useMemo(
    () => [
      {
        title: "Development",
        icon: <FaCode />,
        accent: "var(--cyan)",
        cardClassName: "skill-group-card-frontend",
        items: [
          { name: "Python", level: 92 },
          { name: "React.js", level: 86 },
          { name: "Java", level: 68 },
        ],
      },
      {
        title: "AI / ML",
        icon: <FaPython />,
        accent: "#c026ff",
        cardClassName: "skill-group-card-backend",
        items: [
          { name: "TensorFlow", level: 82 },
          { name: "NLP", level: 84 },
          { name: "OpenCV", level: 78 },
        ],
      },
      {
        title: "Data & Tools",
        icon: <FaGitAlt />,
        accent: "#14f95f",
        cardClassName: "skill-group-card-devops",
        items: [
          { name: "SQL", level: 70 },
          { name: "Power BI", level: 76 },
          { name: "Git & GitHub", level: 84 },
        ],
      },
    ],
    []
  );

  const otherSkillsLogos = useMemo(
    () => [
      { name: "Python", icon: <FaPython style={{ color: "#7cd5ff" }} /> },
      { name: "Java", icon: <FaJava style={{ color: "#ff8b5f" }} /> },
      { name: "React.js", icon: <FaReact style={{ color: "#6af2ff" }} /> },
      { name: "Jupyter", icon: <FaBook style={{ color: "#ffb26b" }} /> },
      { name: "Power BI", icon: <FaChartBar style={{ color: "#ffe072" }} /> },
      { name: "Tableau", icon: <FaTable style={{ color: "#6ac2ff" }} /> },
      { name: "TensorFlow", icon: <span className="skill-lettermark">TF</span> },
      { name: "OpenCV", icon: <FaEye style={{ color: "#9ef7a7" }} /> },
      { name: "Azure", icon: <FaCloud style={{ color: "#5db2ff" }} /> },
      { name: "Git", icon: <FaGitAlt style={{ color: "#ff9360" }} /> },
      { name: "GitHub", icon: <FaGithub style={{ color: "currentColor" }} /> },
      { name: "HTML", icon: <FaHtml5 style={{ color: "#ff8c68" }} /> },
      { name: "SQL", icon: <SiMysql style={{ color: "#89c2ff" }} /> },
      { name: "OpenAI", icon: <span className="skill-lettermark">AI</span> },
    ],
    []
  );

  const educationData = useMemo(
    () => [
      {
        id: 1,
        year: "2022-Present",
        degree: "B.E. in Artificial Intelligence and Machine Learning",
        institution: "CMR Institute of Technology",
        details: "CGPA: 8.51 (expected 2026)",
      },
      {
        id: 2,
        year: "2020-2022",
        degree: "Pre-University Board (PCMB)",
        institution: "St. Joseph's Pre-University College",
        details: "83.3% | 2022",
      },
      {
        id: 3,
        year: "2007-2020",
        degree: "International Council of Secondary Education (ICSE)",
        institution: "Cambridge School",
        details: "81.8% | 2020",
      },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        label: "Email",
        href: "mailto:pranavv736@gmail.com",
        icon: <FaEnvelope />,
      },
      {
        label: "Phone",
        href: "tel:+917676858328",
        icon: <FaPhone />,
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/pranavvenu_/",
        icon: <FaInstagram />,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/pranav-venu-550729264/",
        icon: <FaLinkedin />,
      },
      {
        label: "GitHub",
        href: "https://github.com/pranavv1210",
        icon: <FaGithub />,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@pranavvenu",
        icon: <FaYoutube />,
      },
    ],
    []
  );

  const projectImageMap = useMemo(
    () => ({
      "./assets/resume.jpg": resumeProjectImage,
      "./assets/mental_health_sql.jpg": mentalHealthImage,
      "./assets/document_editor_ai.jpg": documentEditorImage,
    }),
    []
  );

  const scrollToSection = useCallback((sectionRef, sectionName) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionName);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.15,
      }
    );

    menuItems.forEach((item) => {
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
    });

    return () => {
      menuItems.forEach((item) => {
        if (item.ref.current) {
          observer.unobserve(item.ref.current);
        }
      });
      observer.disconnect();
    };
  }, [menuItems]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 900;
      setIsMobileViewport(isMobile);

      if (!isMobile) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const useLiteMotion = prefersReducedMotion || isMobileViewport;

  const sectionVariants = useMemo(
    () => ({
      hidden: useLiteMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
      visible: {
        opacity: 1,
        y: 0,
        transition: useLiteMotion
          ? { duration: 0.01 }
          : {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: 0.08,
            },
      },
    }),
    [useLiteMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: useLiteMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: useLiteMotion ? 0.01 : 0.35 },
      },
    }),
    [useLiteMotion]
  );

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <div className="noise-layer" aria-hidden="true" />
        <div className="scanline-layer" aria-hidden="true" />
        <div className="ambient-grid" aria-hidden="true" />
        <div className="progress-shell" aria-hidden="true">
          <span className="progress-label">build_progress</span>
          <div className="progress-track">
            <motion.span
              className="progress-fill"
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: useLiteMotion ? 0.01 : 0.18 }}
            />
          </div>
          <span className="progress-value">{Math.round(scrollProgress)}%</span>
        </div>

        <header className="topbar">
          <div className="topbar-inner terminal-panel">
            <button
              type="button"
              className="brand-button"
              onClick={() => scrollToSection(homeRef, "home")}
              aria-label="Go to Home"
            >
              <span className="brand-mark">&gt;_</span>
              <span className="brand-copy">
                <strong>Pranav V</strong>
                <span>portfolio</span>
              </span>
            </button>

            <nav className="desktop-nav" aria-label="Primary">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn("nav-link", activeSection === item.id && "active")}
                  onClick={() => scrollToSection(item.ref, item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="topbar-actions">
              <button
                type="button"
                className="icon-button"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.button
                type="button"
                className="mobile-overlay"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                className="mobile-drawer terminal-panel"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "110%", opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                aria-label="Mobile navigation"
              >
                <div className="mobile-drawer-header">
                  <div>
                    <p className="eyebrow">Menu</p>
                    <h2>Portfolio</h2>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mobile-drawer-links">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn("mobile-nav-link", activeSection === item.id && "active")}
                      onClick={() => scrollToSection(item.ref, item.id)}
                    >
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="page-content">
          <section id="home" ref={homeRef} className="hero terminal-panel">
            <div className="hero-copy">
              <div className="terminal-toolbar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <motion.div
                className="hero-title-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                <span className="hero-prompt">$</span>
                <h1 className="hero-title">
                  <span className="text-rotate-sr-only">PRANAV V</span>
                  <TypewriterText text="PRANAV V" className="hero-title-typed" />
                </h1>
              </motion.div>
              <motion.div
                className="hero-rotator"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <span className="hero-prompt hero-subprompt">&gt;</span>
                <RotatingText
                  texts={captions}
                  rotationInterval={2500}
                  splitBy="words"
                  staggerDuration={0.05}
                  staggerFrom="center"
                  mainClassName="hero-rotating-text"
                  elementLevelClassName="hero-rotating-element"
                />
              </motion.div>
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => scrollToSection(projectsRef, "projects")}
                >
                  View My Works
                  <FaArrowRight />
                </button>
                <a className="secondary-button" href="/Pranav_V_Resume.pdf" download="Pranav_V_Resume.pdf">
                  <FaDownload />
                  Download Resume
                </a>
              </motion.div>
            </div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="hero-profile-card terminal-panel">
                <TiltedCard
                  imageSrc={pranavPhoto}
                  altText="Pranav V"
                  containerHeight="460px"
                  containerWidth="100%"
                  imageHeight="460px"
                  imageWidth="100%"
                  rotateAmplitude={8}
                  scaleOnHover={1.03}
                  isInteractive={!useLiteMotion}
                  showTooltip={false}
                />
              </div>
            </motion.div>
          </section>

          <motion.section
            id="about"
            ref={aboutRef}
            className="content-section glass-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
          >
            <motion.div className="section-heading" variants={itemVariants}>
              <h2>About Me</h2>
            </motion.div>
            <div className="about-layout">
              <motion.div className="about-copy" variants={itemVariants}>
                <div className="copy-card">
                  <VariableProximity
                    label="I'm Pranav V, a 21-year-old AI/ML enthusiast born and raised in Bengaluru, currently pursuing my B.E. in Artificial Intelligence and Machine Learning at CMR Institute of Technology (CGPA: 8.51, expected 2026). Immersed in the city's vibrant tech ecosystem, I thrive on coding, collaborating at hackathons, and building intelligent systems that tackle real-world challenges. Bengaluru's innovation-driven spirit fuels my drive to explore the intersection of data, algorithms, and meaningful impact."
                    fromFontVariationSettings="'wght' 400"
                    toFontVariationSettings="'wght' 780"
                    containerRef={aboutRef}
                    radius={42}
                    falloff="gaussian"
                    disabled={useLiteMotion}
                  />
                </div>
                <div className="copy-card">
                  <VariableProximity
                    label="Beyond academics, I find balance through creativity and sport. Cricket and table tennis sharpen my focus and teamwork, while dancing and painting give me space to express and recharge. I'm passionate about blending technology with human-centered design, aiming to contribute ethically to the future of AI. Whether I'm sketching, debugging, or just learning something new, I'm always pushing boundaries and eager to connect with like-minded innovators."
                    fromFontVariationSettings="'wght' 400"
                    toFontVariationSettings="'wght' 780"
                    containerRef={aboutRef}
                    radius={42}
                    falloff="gaussian"
                    disabled={useLiteMotion}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="skills"
            ref={skillsRef}
            className="content-section glass-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
          >
            <motion.div className="section-heading" variants={itemVariants}>
              <h2>Skills</h2>
            </motion.div>

            <motion.div className="skills-panel" variants={itemVariants}>
              <div className="skill-grid">
                {skillGroups.map((group) => (
                  <motion.article
                    key={group.title}
                    className={`skill-group-card ${group.cardClassName}`}
                    variants={itemVariants}
                    whileHover={useLiteMotion ? undefined : { y: -4 }}
                  >
                    <div className="skill-group-header">
                      <span className="skill-group-icon" style={{ color: group.accent }}>
                        {group.icon}
                      </span>
                      <h3>{group.title}</h3>
                    </div>
                    <div className="skill-group-list">
                      {group.items.map((skill) => (
                        <div key={skill.name} className="skill-progress-card skill-progress-row">
                          <div className="skill-progress-head">
                            <span>{skill.name}</span>
                            <strong style={{ color: group.accent }}>{skill.level}%</strong>
                          </div>
                          <div className="skill-meter" aria-hidden="true">
                            <motion.span
                              className="skill-meter-fill"
                              style={{ background: group.accent }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: useLiteMotion ? 0.01 : 0.7, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="section-subheading section-subheading-offset">
                <h4>Toolbox</h4>
              </div>
              <div className="chip-cloud">
                {otherSkillsLogos.map((skill) => (
                  <motion.div
                    key={skill.name}
                    className="skill-chip"
                    variants={itemVariants}
                    whileHover={useLiteMotion ? undefined : { y: -4 }}
                  >
                    <span className="skill-chip-icon">{skill.icon}</span>
                    <span>{skill.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="resume-row">
                <a className="secondary-button" href="/Pranav_V_Resume.pdf" download="Pranav_V_Resume.pdf">
                  <FaDownload />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            id="education"
            ref={educationRef}
            className="content-section glass-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
          >
            <motion.div className="section-heading" variants={itemVariants}>
              <h2>Education</h2>
            </motion.div>
            <div className="timeline-list">
              {educationData.map((education) => (
                <motion.article key={education.id} className="timeline-card" variants={itemVariants}>
                  <div className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-content">
                    <p className="timeline-year">{education.year}</p>
                    <h3>{education.degree}</h3>
                    <p>{education.institution}</p>
                    {education.details && <span className="timeline-detail">{education.details}</span>}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="projects"
            ref={projectsRef}
            className="content-section glass-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <motion.div className="section-heading" variants={itemVariants}>
              <h2>Projects</h2>
            </motion.div>
            <div className="project-grid">
              {projects.map((project) => (
                <motion.article
                  key={project.id}
                  className="project-card"
                  variants={itemVariants}
                  whileHover={useLiteMotion ? undefined : { y: -6 }}
                >
                  {project.imageSrc && (
                    <a
                      href={project.githubLink || "#"}
                      target={project.githubLink ? "_blank" : "_self"}
                      rel={project.githubLink ? "noopener noreferrer" : undefined}
                      className="project-media"
                    >
                      <img src={projectImageMap[project.imageSrc]} alt={project.title} />
                    </a>
                  )}
                  <div className="project-body">
                    {project.tagLabel && (
                      <div className="tag-row project-meta">
                        <span className="tag">{project.tagLabel}</span>
                      </div>
                    )}
                    <h3>{project.title}</h3>
                    <div
                      className={`project-description ${
                        project.story ? "project-description-compact" : ""
                      }`}
                    >
                      <VariableProximity
                        label={project.description}
                        fromFontVariationSettings="'wght' 400"
                        toFontVariationSettings="'wght' 760"
                        containerRef={projectsRef}
                        radius={34}
                        falloff="gaussian"
                        disabled={useLiteMotion}
                      />
                    </div>
                    <div className="tag-row">
                      {project.techStack.map((stackItem) => (
                        <span key={stackItem} className="tag">
                          {stackItem}
                        </span>
                      ))}
                    </div>
                    <div className="project-actions">
                      {project.story ? (
                        <>
                          <button
                            type="button"
                            className="text-link project-toggle"
                            onClick={() =>
                              setExpandedProjectId((current) =>
                                current === project.id ? null : project.id
                              )
                            }
                            aria-expanded={expandedProjectId === project.id}
                          >
                            {expandedProjectId === project.id ? "Hide Details" : "View Details"}
                            <FaEye />
                          </button>
                          <AnimatePresence initial={false}>
                            {expandedProjectId === project.id && (
                              <motion.div
                                className="project-details"
                                initial={useLiteMotion ? false : { opacity: 0, y: 8 }}
                                animate={useLiteMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                exit={useLiteMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <div className="project-details-copy">
                                  <p className="project-details-tagline">Ride Together. Ride Safe.</p>
                                  <h4>{project.title}</h4>
                                  <p>{project.story}</p>
                                </div>
                                <div className="project-detail-block">
                                  <span className="project-detail-label">Features</span>
                                  <ul className="project-detail-list">
                                    {project.featureList?.map((item) => (
                                      <li key={item}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="project-detail-block">
                                  <span className="project-detail-label">Tech Stack</span>
                                  <div className="tag-row">
                                    {project.techStack.map((stackItem) => (
                                      <span key={stackItem} className="tag">
                                        {stackItem}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="project-cta-row">
                                  <a
                                    href={project.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="primary-button"
                                  >
                                    View App
                                    <FaExternalLinkAlt />
                                  </a>
                                  <a
                                    href={project.downloadLink || project.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="secondary-button"
                                  >
                                    Download App
                                    <FaDownload />
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link"
                        >
                          View Project
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="github-projects"
            ref={githubProjectsRef}
            className="content-section github-banner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            style={{ backgroundImage: `linear-gradient(135deg, rgba(8, 13, 28, 0.88), rgba(54, 18, 71, 0.58)), url(${githubCtaBg})` }}
          >
            <motion.div className="github-banner-content" variants={itemVariants}>
              <h2>More on GitHub</h2>
              <p>Check Out!!</p>
              <a
                href="https://github.com/pranavv1210"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
              >
                GITHUB
                <FaArrowRight />
              </a>
            </motion.div>
          </motion.section>

          <motion.section
            id="contact"
            ref={contactRef}
            className="content-section glass-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.div className="section-heading" variants={itemVariants}>
              <h2>Contact</h2>
            </motion.div>
            <motion.p className="contact-intro" variants={itemVariants}>
              Use any of the platforms below to get in touch.
            </motion.p>
            <motion.div className="contact-grid" variants={itemVariants}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="contact-card"
                  aria-label={link.label}
                >
                  <span className="contact-icon">{link.icon}</span>
                  <span className="contact-label">{link.label}</span>
                </a>
              ))}
            </motion.div>
          </motion.section>
        </main>

        <footer className="site-footer">
          <div className="site-footer-inner">
            <p>
              Made with <span className="footer-heart">{"\u2665"}</span> by Pranav
            </p>
            <nav className="footer-links" aria-label="Footer quick links">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="footer-link"
                  onClick={() => scrollToSection(item.ref, item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;

