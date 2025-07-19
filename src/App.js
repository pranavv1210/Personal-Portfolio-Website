import React, { useState, useRef, useEffect, forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaInstagram, FaLinkedin, FaYoutube, FaHome, FaUser, FaBriefcase, FaPaperPlane, FaGithub, FaGraduationCap } from 'react-icons/fa';
import {
  FaPython,
  FaJsSquare,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaAws,
} from 'react-icons/fa';
import { SiTensorflow } from 'react-icons/si';
import projects from './projects.json';
import ErrorBoundary from './ErrorBoundary';
import VariableProximity from './VariableProximity';
import Aurora from './Aurora';
import TiltedCard from './TiltedCard';
import { ScrollVelocity } from './ScrollVelocity'; // Corrected import syntax
import Dock from './Dock';
import pranavPhoto from './assets/pranav-photo.jpg';
import githubCtaBg from './assets/image_616736.jpg'; // Ensure this image is in src/assets/

import './App.css';
import './Dock.css';

// RotatingText Component (remains unchanged)
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

  const elements = React.useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === "words") {
      return currentText.split(" ").map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === "lines") {
      return currentText.split("\n").map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
        characters: [part],
        needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
    if (staggerFrom === "random") {
      const randomIndex = Math.floor(Math.random() * total);
      return Math.abs(randomIndex - index) * staggerDuration;
    }
    return Math.abs(staggerFrom - index) * staggerDuration;
  },
  [staggerFrom, staggerDuration]
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
}, [currentTextIndex, texts.length, loop, handleIndexChange]);

const previous = useCallback(() => {
  const prevIndex =
    currentTextIndex === 0
      ? loop
        ? texts.length - 1
        : currentTextIndex
      : currentTextIndex - 1;
  if (prevIndex !== currentTextIndex) {
    handleIndexChange(prevIndex);
  }
}, [currentTextIndex, texts.length, loop, handleIndexChange]);

const jumpTo = useCallback(
  (index) => {
    const validIndex = Math.max(0, Math.min(index, texts.length - 1));
    if (validIndex !== currentTextIndex) {
      handleIndexChange(validIndex);
    }
  },
  [texts.length, currentTextIndex, handleIndexChange]
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
  [next, previous, jumpTo, reset]
);

useEffect(() => {
  if (!auto) return;
  const intervalId = setInterval(next, rotationInterval);
  return () => clearInterval(intervalId);
}, [next, rotationInterval, auto]);

return (
  <motion.span
    className={cn("text-rotate", mainClassName)}
    {...rest}
    layout
    transition={transition}
  >
    <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
    <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
      <motion.div
        key={currentTextIndex}
        className={cn(
          splitBy === "lines" ? "text-rotate-lines" : "text-rotate"
        )}
        layout
        aria-hidden="true"
      >
        {elements.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0);
          return (
            <span
              key={wordIndex}
              className={cn("text-rotate-word", splitLevelClassName)}
            >
              {wordObj.characters.map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{
                    ...transition,
                    delay: getStaggerDelay(
                      previousCharsCount + charIndex,
                      array.reduce(
                        (sum, word) => sum + word.characters.length,
                        0
                      )
                    ),
                  }}
                  className={cn("text-rotate-element", elementLevelClassName)}
                >
                  {char}
                </motion.span>
              ))}
              {wordObj.needsSpace && (
                <span className="text-rotate-space"> </span>
              )}
            </span>
          );
        })}
      </motion.div>
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
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const githubProjectsRef = useRef(null);
  const contactRef = useRef(null);

  const [activeSection, setActiveSection] = useState('home');
  const [showDock, setShowDock] = useState(true); // State to control dock visibility

  const scrollToSection = useCallback((sectionRef, sectionName) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionName);
  }, []);

  const menuItems = useMemo(() => [
    { link: "#home", text: "Home", ref: homeRef },
    { link: "#about", text: "About Me", ref: aboutRef },
    { link: "#education", text: "Education", ref: educationRef },
    { link: "#projects", text: "My Works", ref: projectsRef },
    { link: "#github-projects", text: "More Projects", ref: githubProjectsRef },
    { link: "#contact", text: "Reach Me", ref: contactRef },
  ], [homeRef, aboutRef, educationRef, projectsRef, githubProjectsRef, contactRef]);

  // Scroll handler to hide/show dock
  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    // Hide dock if scrolled near the bottom (e.g., within 100px of the very bottom)
    // Adjust 100 to change how close to the bottom it disappears
    const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 100);

    setShowDock(!isAtBottom);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    menuItems.forEach(item => {
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
    });

    // Add scroll event listener for dock visibility
    window.addEventListener('scroll', handleScroll);

    return () => {
      menuItems.forEach(item => {
        if (item.ref.current) {
          observer.unobserve(item.ref.current);
        }
      });
      // Clean up scroll event listener
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuItems, handleScroll]);


  const sectionVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const captions = [
    "Emerging AIML Engineer",
    "AI Enthusiast",
    "Innovator in Tech",
  ];

  const skills = [
    { name: "Python", logo: <FaPython style={{ color: '#3776AB' }} /> },
    { name: "JavaScript", logo: <FaJsSquare style={{ color: '#F7DF1E' }} /> },
    { name: "React", logo: <FaReact style={{ color: '#61DAFB' }} /> },
    { name: "TensorFlow", logo: <SiTensorflow style={{ color: '#FF6A00' }} /> },
    { name: "Node.js", logo: <FaNodeJs style={{ color: '#339933' }} /> },
    { name: "SQL", logo: <FaDatabase style={{ color: '#4479A1' }} /> },
    { name: "Git", logo: <FaGitAlt style={{ color: '#F05032' }} /> },
    { name: "AWS", logo: <FaAws style={{ color: '#FF9900' }} /> },
  ];

  // Education data - CGPA details removed
  const educationData = useMemo(() => [
    {
      id: 1,
      year: "2022-Present",
      degree: "B.E. in Artificial Intelligence and Machine Learning",
      institution: "CMR Institute of Technology",
    },
    {
      id: 2,
      year: "2020-2022",
      degree: "Pre-University Board (PCMB)",
      institution: "St. Joseph's Pre-University College"
    },
    {
      id: 3,
      year: "2007-2020",
      degree: "International Council of Secondary Education (ICSE)",
      institution: "Cambridge School"
    }
  ], []);

  // Dock items - Education and More Projects options removed
  const dockItems = [
    {
      label: "Home",
      icon: <FaHome size={24} color="#fff" />,
      onClick: () => scrollToSection(homeRef, 'home'),
      isActive: activeSection === 'home'
    },
    {
      label: "About Me",
      icon: <FaUser size={24} color="#fff" />,
      onClick: () => scrollToSection(aboutRef, 'about'),
      isActive: activeSection === 'about'
    },
    {
      label: "My Works",
      icon: <FaBriefcase size={24} color="#fff" />,
      onClick: () => scrollToSection(projectsRef, 'projects'),
      isActive: activeSection === 'projects'
    },
    {
      label: "Reach Me",
      icon: <FaPaperPlane size={24} color="#fff" />,
      onClick: () => scrollToSection(contactRef, 'contact'),
      isActive: activeSection === 'contact'
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-dark-gray text-light-gray font-inter overflow-hidden">
        <Aurora
          colorStops={['#1a1a2e', '#16213e', '#0f3460']}
          amplitude={1.5}
          blend={0.7}
        />

        <div className="absolute inset-0 z-0"></div>

        <div className="relative z-10 pb-20">

          {/* Hero Section */}
          <section
            id="home"
            ref={homeRef}
            className="hero-section flex flex-col justify-center items-center text-center h-screen px-4"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold text-light-gray mb-4 font-heading"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              PRANAV V
            </motion.h1>
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            >
              <RotatingText
                texts={captions}
                rotationInterval={2500}
                splitBy="words"
                staggerDuration={0.07}
                staggerFrom="center"
                mainClassName="text-3xl md:text-4xl text-medium-gray font-semibold inline-block"
                elementLevelClassName="tracking-wide"
              />
            </motion.div>
            <motion.button
              className="mt-12 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
              onClick={() => scrollToSection(aboutRef, 'about')}
            >
              Learn More About Me
            </motion.button>
          </section>

          {/* About Me Section */}
          <motion.section
            id="about"
            ref={aboutRef}
            className="section-card py-16 px-6 max-w-7xl mx-auto my-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-10 text-center text-light-gray font-heading"
              variants={textVariants}
            >
              About Me
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div
                className="md:w-1/2 flex justify-center order-2 md:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <TiltedCard
                  imageSrc={pranavPhoto}
                  altText="Pranav V"
                  containerHeight="500px"
                  containerWidth="100%"
                  imageHeight="500px"
                  imageWidth="100%"
                  scaleOnHover={1.05}
                  rotateAmplitude={10}
                  showTooltip={false}
                />
              </motion.div>
              <div className="md:w-1/2 space-y-6 order-1 md:order-2">
                <motion.p
                  className="text-lg leading-relaxed text-justify text-light-gray"
                  variants={textVariants}
                >
                  <VariableProximity
                    label="I’m Pranav V, a 21-year-old AI/ML enthusiast born and raised in Bengaluru, currently pursuing my B.E. in Artificial Intelligence and Machine Learning at CMR Institute of Technology (CGPA: 8.42, expected 2026). Immersed in the city’s vibrant tech ecosystem, I thrive on coding, collaborating at hackathons, and building intelligent systems that tackle real-world challenges. Bengaluru’s innovation-driven spirit fuels my drive to explore the intersection of data, algorithms, and meaningful impact."
                    fromFontVariationSettings="'wght' 400"
                    toFontVariationSettings="'wght' 900"
                    containerRef={aboutRef}
                    radius={40}
                    falloff="gaussian"
                  />
                </motion.p>
                <motion.p
                  className="text-lg leading-relaxed text-justify text-light-gray"
                  variants={textVariants}
                >
                  <VariableProximity
                    label="Beyond academics, I find balance through creativity and sport. Cricket and table tennis sharpen my focus and teamwork, while dancing and painting give me space to express and recharge. I’m passionate about blending technology with human-centered design, aiming to contribute ethically to the future of AI. Whether I’m sketching, debugging, or just learning something new, I’m always pushing boundaries and eager to connect with like-minded innovators."
                    fromFontVariationSettings="'wght' 400"
                    toFontVariationSettings="'wght' 900"
                    containerRef={aboutRef}
                    radius={40}
                    falloff="gaussian"
                  />
                </motion.p>
              </div>
            </div>
            <motion.div
              className="mt-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <h3 className="text-3xl font-bold mb-8 text-center text-light-gray">My Skills</h3>
              <ScrollVelocity
                scrollContainerRef={aboutRef}
                skills={skills}
                velocity={-50}
                className="skills-text"
                damping={50}
                stiffness={400}
                numCopies={6}
                velocityMapping={{ input: [0, 1000], output: [0, 5] }}
                parallaxClassName="parallax"
                scrollerClassName="scroller"
                parallaxStyle={{ marginTop: '20px' }}
                scrollerStyle={{}}
              />
              <motion.div className="flex justify-center mt-10">
                <motion.a
                  href="/Pranav_V_Resume.pdf"
                  download="Pranav_V_Resume.pdf"
                  className="relative inline-block px-8 py-3 text-white font-roboto text-lg font-semibold rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Download Resume</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* New Education Section */}
          <motion.section
            id="education"
            ref={educationRef}
            className="section-card py-16 px-6 max-w-7xl mx-auto my-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-10 text-center text-light-gray font-heading education-heading"
              variants={textVariants}
            >
              Education
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationData.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="education-card p-6 bg-gray-700 bg-opacity-70 rounded-xl shadow-lg border border-gray-600 transform hover:scale-[1.02] transition-transform duration-300 ease-in-out"
                  variants={textVariants}
                  custom={index}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">{edu.year}</h3>
                  <p className="text-lg text-white mb-1">{edu.degree}</p>
                  <p className="text-md text-gray-300">{edu.institution}</p>
                  {edu.details && <p className="text-sm text-gray-400 mt-2">{edu.details}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* GitHub Projects Call to Action Section */}
          <motion.section
            id="github-projects"
            ref={githubProjectsRef}
            className="github-cta-section flex flex-col justify-center items-center text-center py-20 px-6 my-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            style={{ backgroundImage: `url(${githubCtaBg})` }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-extrabold text-blue-400 mb-4 font-heading"
              variants={textVariants}
            >
              More projects on Github
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-white mb-8"
              variants={textVariants}
            >
              Check Out!!
            </motion.p>
            <motion.a
              href="https://github.com/pranavv1210"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              variants={textVariants}
            >
              GITHUB
            </motion.a>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            id="contact"
            ref={contactRef}
            className="section-card py-16 px-6 text-center max-w-6xl mx-auto my-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-10 text-light-gray font-heading"
              variants={textVariants}
            >
              Reach Me
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              variants={textVariants}
            >
              Feel free to connect with me through any of the platforms below. Just reach out on:
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-8 md:gap-12"
              variants={textVariants}
            >
              <motion.a
                href="mailto:pranavv736@gmail.com"
                className="text-light-gray hover:text-blue-400 transform hover:scale-125 transition-transform duration-200"
                aria-label="Email Pranav"
              >
                <FaEnvelope size={40} />
              </motion.a>
              <motion.a
                href="tel:+917676858328"
                className="text-light-gray hover:text-green-400 transform hover:scale-125 transition-transform duration-200"
                aria-label="Call Pranav"
              >
                <FaPhone size={40} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/pranavvenu_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-pink-400 transform hover:scale-125 transition-transform duration-200"
                aria-label="Visit Pranav's Instagram"
              >
                <FaInstagram size={40} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/pranav-venu-550729264/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-blue-500 transform hover:scale-125 transition-transform duration-200"
                aria-label="Visit Pranav's LinkedIn"
              >
                <FaLinkedin size={40} />
              </motion.a>
              <motion.a
                href="https://github.com/pranavv1210"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-gray-400 transform hover:scale-125 transition-transform duration-200"
                aria-label="Visit Pranav's GitHub"
              >
                <FaGithub size={40} />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@pranavvenu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-red-500 transform hover:scale-125 transition-transform duration-200"
                aria-label="Visit Pranav's YouTube"
              >
                <FaYoutube size={40} />
              </motion.a>
            </motion.div>
          </motion.section>
        </div>

        {/* Footer: Made with ❤️ by Pranav */}
        <motion.footer
          className="w-full py-6 text-center text-gray-400 text-sm bg-dark-gray"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Made with <span style={{ color: '#ff6b6b' }}>♥</span> by Pranav
        </motion.footer>

        {/* Dock - Conditionally rendered with AnimatePresence */}
        <AnimatePresence>
          {showDock && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dock items={dockItems} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;