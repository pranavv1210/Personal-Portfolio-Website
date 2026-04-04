import ScrollyCanvas from './components/ScrollyCanvas'
import AboutAndSkills from './components/AboutAndSkills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiPhone } from 'react-icons/fi'

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen w-full flex flex-col text-white selection:bg-purple-500/30">
      {/* Hero scrollytelling section */}
      <ScrollyCanvas />
      
      {/* About & Skills */}
      <AboutAndSkills />

      {/* Experience & Education */}
      <Experience />

      {/* Projects */}
      <Projects />
      
      {/* Footer */}
      <footer className="py-20 px-6 bg-[#0a0a0a] border-t border-white/5 flex flex-col items-center justify-center text-center text-gray-500 gap-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a href="https://github.com/pranavv1210" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <FiGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/pranav-venu-550729264/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <FiLinkedin size={24} />
          </a>
          <a href="mailto:pranavv736@gmail.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <FiMail size={24} />
          </a>
          <a href="tel:+917676858328" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <FiPhone size={24} />
          </a>
          <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <FiInstagram size={24} />
          </a>
        </div>
        
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-widest uppercase">
            © {new Date().getFullYear()} Pranav V. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Based in Bengaluru, India.
          </p>
        </div>
      </footer>
    </main>
  )
}

