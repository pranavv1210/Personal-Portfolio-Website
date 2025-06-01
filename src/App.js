import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import projects from './projects.json';
import { FaEnvelope, FaPhone, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './App.css';

function App() {
  useEffect(() => {
  // Initialize tsparticles for enhanced digital wave
  window.tsParticles.load('wave-bg', {
    particles: {
      number: { value: window.innerWidth < 768 ? 40 : 80 }, // Fewer particles on mobile
      color: { value: ['#00E7FF', '#FFD700'] },
      shape: { type: ['circle', 'triangle'] },
      opacity: { value: 0.7, random: { enable: true, minimumValue: 0.3 } },
      size: { value: 4, random: { enable: true, minimumValue: 2 } },
      move: {
        enable: true,
        speed: 2,
        direction: 'top-right',
        random: true,
        outModes: { default: 'out' },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#00E7FF',
        opacity: 0.4,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'connect' },
        onClick: { enable: true, mode: 'push' },
      },
      modes: {
        connect: { distance: 200, radius: 400 },
        push: { quantity: 4 },
      },
    },
    background: { color: '#0A0E2A' },
  });
}, []);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  // Animation for nav links
  const linkVariants = {
    hover: { scale: 1.15, color: '#FFD700', transition: { duration: 0.3 } },
  };

  // Animation for text children
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-space-navy text-light-silver font-inter relative overflow-hidden">
      {/* Digital Wave Background */}
      <div id="wave-bg" className="absolute inset-0 z-0"></div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-steel opacity-30 z-0"></div>

      {/* Navigation Bar */}
      <motion.nav
        className="bg-dark-steel bg-opacity-95 p-4 shadow-lg sticky top-0 z-20 border-b border-bright-cyan/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <ul className="flex space-x-10 justify-center">
          {['about', 'projects', 'contact'].map((section) => (
            <motion.li key={section}>
              <motion.a
                href={`#${section}`}
                className="text-bright-cyan text-lg"
                variants={linkVariants}
                whileHover="hover"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.a>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="hero"
        className="py-20 px-4 text-center relative z-10 max-w-4xl mx-auto my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 text-bright-cyan"
          variants={textVariants}
        >
          Pranav V
        </motion.h1>
        <motion.p
          className="text-xl text-light-silver"
          variants={textVariants}
        >
          AI/ML Innovator
        </motion.p>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-12 px-4 relative z-10 max-w-6xl mx-auto bg-dark-steel bg-opacity-80 rounded-xl shadow-2xl my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="flex flex-col md:flex-row items-center min-h-screen">
          <div className="md:w-1/2 p-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-bright-cyan"
              variants={textVariants}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-lg mb-4 leading-relaxed"
              variants={textVariants}
            >
              I’m Pranav V, a 21-year-old AI/ML enthusiast born and raised in Bengaluru, India’s Silicon Valley. As a B.E. student in Artificial Intelligence and Machine Learning at CMR Institute of Technology (CGPA: 8.42, expected 2026), I’m fueled by the city’s dynamic tech ecosystem. From coding in bustling co-working spaces to brainstorming at hackathons, Bengaluru’s energy drives my passion for building intelligent systems that solve real-world challenges.
            </motion.p>
            <motion.p
              className="text-lg mb-4 leading-relaxed"
              variants={textVariants}
            >
              Outside the classroom, I’m all about balance and creativity. Cricket is my go-to sport—I love the thrill of a well-played cover drive or strategizing with teammates on the field. Table tennis keeps me sharp, with quick reflexes and friendly matches that spark laughter. Dancing is my escape, whether it’s mastering a new routine or freestyling to a favorite beat. Painting is where I pour my imagination, blending colors to create landscapes or abstract pieces that reflect my thoughts.
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed"
              variants={textVariants}
            >
              As a proud Bengalurean, I’m inspired by the city’s blend of tradition and innovation. My goal is to contribute to AI’s future, crafting solutions that are as impactful as they are ethical. Whether I’m debugging code, smashing a forehand, or sketching a new artwork, I’m always learning, creating, and pushing boundaries. Let’s connect and shape what’s next!
            </motion.p>
          </div>
          <motion.div
            className="md:w-1/2 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <img
              src="/assets/pranav-photo.jpg"
              alt="Pranav V"
              className="w-full h-screen object-cover rounded-lg shadow-lg border border-bright-cyan/50"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="py-12 px-4 relative z-10 max-w-6xl mx-auto bg-dark-steel bg-opacity-80 rounded-xl shadow-2xl my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <motion.h2
          className="text-3xl font-bold mb-6 text-center text-bright-cyan"
          variants={textVariants}
        >
          My Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={textVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-bold text-bright-cyan mb-2">{project.title}</h3>
              <p className="text-light-silver mb-4">{project.description}</p>
              <div className="tech-stack">
                <p className="text-bright-cyan font-semibold mr-2">Tech Stack:</p>
                {project.techStack.map((tech, index) => (
                  <span key={index}>{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>



{/* Connect With Me Section */}
<motion.section
  id="connect"
  className="py-12 px-4 text-center relative z-10 max-w-4xl mx-auto bg-dark-steel bg-opacity-80 rounded-xl shadow-2xl my-12"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>
  <motion.h2
    className="text-3xl font-bold mb-6 text-bright-cyan"
    variants={textVariants}
  >
    Connect Me
  </motion.h2>
  <motion.div
    className="max-w-md mx-auto flex flex-wrap justify-center gap-6"
    variants={textVariants}
  >
    <motion.a
      href="pranavv736@gmail.com"
      className="text-bright-cyan hover:text-gold-accent"
      aria-label="Email Pranav"
      whileHover={{ scale: 1.2 }}
    >
      <FaEnvelope size={32} />
    </motion.a>
    <motion.a
      href="tel:+919876543210"
      className="text-bright-cyan hover:text-gold-accent"
      aria-label="Call Pranav"
      whileHover={{ scale: 1.2 }}
    >
      <FaPhone size={32} />
    </motion.a>
    <motion.a
      href="https://www.instagram.com/pranavvenu_/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-bright-cyan hover:text-gold-accent"
      aria-label="Visit Pranav's Instagram"
      whileHover={{ scale: 1.2 }}
    >
      <FaInstagram size={32} />
    </motion.a>
    <motion.a
      href="https://www.linkedin.com/in/pranav-venu-550729264/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-bright-cyan hover:text-gold-accent"
      aria-label="Visit Pranav's LinkedIn"
      whileHover={{ scale: 1.2 }}
    >
      <FaLinkedin size={32} />
    </motion.a>
    <motion.a
      href="https://www.youtube.com/@pranavvenu"
      target="_blank"
      rel="noopener noreferrer"
      className="text-bright-cyan hover:text-gold-accent"
      aria-label="Visit Pranav's YouTube"
      whileHover={{ scale: 1.2 }}
    >
      <FaYoutube size={32} />
    </motion.a>
  </motion.div>
  <motion.a
    href="/assets/PRANAV RESUME.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 inline-block bg-bright-cyan text-dark-steel px-6 py-3 rounded-lg font-semibold glow-button"
    whileHover={{ scale: 1.05, backgroundColor: '#FFD700' }}
    whileTap={{ scale: 0.95 }}
    variants={textVariants}
    title="View Pranav's Resume"
    aria-label="View Pranav's Resume in a new tab"
  >
    View Resume
  </motion.a>
</motion.section>
    </div>
  );
}

export default App;