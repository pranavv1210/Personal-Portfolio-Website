import React, { useState, useRef, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaInstagram, FaLinkedin, FaYoutube, FaHome, FaUser, FaBriefcase, FaPaperPlane } from 'react-icons/fa';
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
import FlowingMenu from './FlowingMenu';
import TiltedCard from './TiltedCard';
import { ScrollVelocity } from './ScrollVelocity';
import Dock from './Dock';
import pranavPhoto from './assets/pranav-photo.jpg';
import './App.css';
import './Dock.css';

// RotatingText Component
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
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);

  const menuItems = [
    { link: "#about", text: "About Me" },
    { link: "#projects", text: "My Works" },
    { link: "#contact", text: "Reach Me" },
  ];

  const handleMenuItemClick = (link) => {
    setIsMenuVisible(false);
    setSelectedSection(link.replace("#", ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToMenu = () => {
    setIsMenuVisible(true);
    setSelectedSection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

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

  const captions = [
    "Emerging AIML Engineer",
    "AI Enthusiast",
    "Innovator in Tech",
  ];

  const dockItems = [
    {
      label: "Home",
      icon: <FaHome size={24} color="#fff" />,
      onClick: handleBackToMenu,
    },
    {
      label: "About Me",
      icon: <FaUser size={24} color="#fff" />,
      onClick: () => handleMenuItemClick("#about"),
    },
    {
      label: "My Works",
      icon: <FaBriefcase size={24} color="#fff" />,
      onClick: () => handleMenuItemClick("#projects"),
    },
    {
      label: "Reach Me",
      icon: <FaPaperPlane size={24} color="#fff" />,
      onClick: () => handleMenuItemClick("#contact"),
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-dark-gray text-light-gray font-inter overflow-hidden">
        <Aurora
          colorStops={['#1E1E1E', '#808080', '#D0D0D0']}
          amplitude={1.2}
          blend={0.6}
        />

        <div className="absolute inset-0 z-1"></div>

        <AnimatePresence>
          {isMenuVisible && (
            <motion.div
              className="menu-container"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <FlowingMenu
                items={menuItems.map(item => ({
                  ...item,
                  link: "#",
                  onClick: (e) => {
                    e.preventDefault();
                    handleMenuItemClick(item.link);
                  },
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isMenuVisible && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 pb-20"
            >
              {selectedSection === "about" && (
                <motion.section
                  id="about"
                  ref={aboutRef}
                  className="py-12 px-4 relative z-10 max-w-6xl mx-auto bg-medium-gray bg-opacity-80 rounded-xl shadow-2xl my-12 font-roboto"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <div className="flex flex-col md:flex-row items-center relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
                      <h3
                        className="text-4xl font-bold text-light-gray"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        PRANAV V
                      </h3>
                      <div className="flex justify-center mt-1 w-full">
                        <RotatingText
                          texts={captions}
                          rotationInterval={2000}
                          splitBy="words"
                          staggerDuration={0.05}
                          staggerFrom="center"
                          className="text-xl text-light-gray font-medium inline-block"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 pt-32 flex justify-center">
                      <div className="max-w-md">
                        <motion.div
                          className="text-lg mb-4 leading-relaxed text-justify"
                          variants={textVariants}
                        >
                          <VariableProximity
                            label="I’m Pranav V, a 21-year-old AI/ML enthusiast born and raised in Bengaluru, currently pursuing my B.E. in Artificial Intelligence and Machine Learning at CMR Institute of Technology (CGPA: 8.42, expected 2026). Immersed in the city’s vibrant tech ecosystem, I thrive on coding, collaborating at hackathons, and building intelligent systems that tackle real-world challenges. Bengaluru’s innovation-driven spirit fuels my drive to explore the intersection of data, algorithms, and meaningful impact."
                            fromFontVariationSettings="'wght' 400"
                            toFontVariationSettings="'wght' 900"
                            containerRef={aboutRef}
                            radius={30}
                            falloff="gaussian"
                          />
                        </motion.div>
                        <motion.div
                          className="text-lg mb-4 leading-relaxed text-justify"
                          variants={textVariants}
                        >
                          <VariableProximity
                            label="Beyond academics, I find balance through creativity and sport. Cricket and table tennis sharpen my focus and teamwork, while dancing and painting give me space to express and recharge. I’m passionate about blending technology with human-centered design, aiming to contribute ethically to the future of AI. Whether I’m sketching, debugging, or just learning something new, I’m always pushing boundaries and eager to connect with like-minded innovators."
                            fromFontVariationSettings="'wght' 400"
                            toFontVariationSettings="'wght' 900"
                            containerRef={aboutRef}
                            radius={30}
                            falloff="gaussian"
                          />
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="md:w-1/2 p-4 pt-20 flex justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, delay: 0.2 }}
                    >
                      <TiltedCard
                        imageSrc={pranavPhoto}
                        altText="Pranav V"
                        containerHeight="500px"
                        containerWidth="100%"
                        imageHeight="500px"
                        imageWidth="100%"
                        scaleOnHover={1.1}
                        rotateAmplitude={14}
                        showTooltip={false}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="mt-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-center text-light-gray">My Skills</h3>
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
                    <motion.div className="flex justify-center mt-6">
                      <motion.a
                        href="/public/assets/pranav-resume.pdf"
                        download="pranav-resume.pdf"
                        className="relative inline-block px-6 py-2 text-light-gray font-roboto text-lg font-semibold rounded-full overflow-hidden bg-medium-gray bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">My Resume</span>
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-light-gray to-transparent opacity-0"
                          whileHover={{ opacity: 0.3, x: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </motion.section>
              )}

              {selectedSection === "projects" && (
                <motion.section
                  id="projects"
                  ref={projectsRef}
                  className="py-12 px-4 relative z-10 max-w-6xl mx-auto bg-medium-gray bg-opacity-80 rounded-xl shadow-2xl my-12 font-roboto"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <motion.h2
                    className="text-4xl font-bold mb-6 text-center text-light-gray font-heading"
                    variants={textVariants}
                  >
                    My Works
                  </motion.h2>
                  <div className="grid grid-cols-1 gap-8">
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        className="project-card p-6"
                        variants={textVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        <h3 className="text-2xl font-bold text-light-gray mb-3">{project.title}</h3>
                        <div className="text-lg text-light-gray mb-4 text-justify">
                          <VariableProximity
                            label={project.description}
                            fromFontVariationSettings="'wght' 400"
                            toFontVariationSettings="'wght' 900"
                            containerRef={projectsRef}
                            radius={30}
                            falloff="gaussian"
                          />
                        </div>
                        <div className="tech-stack">
                          <p className="text-light-gray font-semibold mr-2 inline">Tech Stack:</p>
                          {project.techStack.map((stackItem, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-gray-200 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 mr-2 mb-2"
                            >
                              {stackItem}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {selectedSection === "contact" && (
                <motion.section
                  id="contact"
                  className="py-12 px-4 text-center relative z-10 max-w-4xl mx-auto bg-medium-gray bg-opacity-80 rounded-xl shadow-2xl my-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <motion.h2
                    className="text-4xl font-bold mb-6 text-light-gray font-heading"
                    variants={textVariants}
                  >
                    Reach Me
                  </motion.h2>
                  <motion.div
                    className="max-w-md mx-auto flex flex-wrap justify-center gap-6"
                    variants={textVariants}
                  >
                    <motion.a
                      href="mailto:pranavv736@gmail.com"
                      className="text-light-gray hover:text-white"
                      aria-label="Email Pranav"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaEnvelope size={32} />
                    </motion.a>
                    <motion.a
                      href="tel:+917676858328"
                      className="text-light-gray hover:text-white"
                      aria-label="Call Pranav"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaPhone size={32} />
                    </motion.a>
                    <motion.a
                      href="https://www.instagram.com/pranavvenu_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-gray hover:text-white"
                      aria-label="Visit Pranav's Instagram"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaInstagram size={32} />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/pranav-venu-550729264/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-gray hover:text-white"
                      aria-label="Visit Pranav's LinkedIn"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaLinkedin size={32} />
                    </motion.a>
                    <motion.a
                      href="https://www.youtube.com/@pranavvenu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-gray hover:text-white"
                      aria-label="Visit Pranav's YouTube"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaYoutube size={32} />
                    </motion.a>
                  </motion.div>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditionally render the Dock only when not on the home page */}
        {!isMenuVisible && (
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <Dock items={dockItems} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;