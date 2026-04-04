'use client'

import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

import ArchitectureDiagram from './ArchitectureDiagram'

const projects = [
  {
    title: 'JourneySync App (Startup Idea)',
    category: 'Full-Stack • Real-time',
    desc: 'A comprehensive platform for live ride coordination and journey management. Features real-time maps, sophisticated user lobbies, ride radar, and a join-request approval flow designed to streamline shared travel.',
    color: 'from-pink-500/30 to-rose-500/30',
    repoUrl: 'https://github.com/pranavv1210/JourneySync-App'
  },
  {
    title: 'AI Resume Screener & Chatbot',
    category: 'React • Node.js • NLP',
    desc: 'Automates resume screening and candidate engagement. Uses Hugging Face & spaCy NLP to semantically match candidates, providing explainable scores and real-time chatbot feedback.',
    color: 'from-purple-500/30 to-blue-500/30',
    repoUrl: 'https://github.com/pranavv1210/AI-Driven-Resume-Screening'
  },
  {
    title: 'T&C Summarizer (n8n & FAISS)',
    category: 'Python • Flask • GenAI',
    desc: 'Generates plain-language summaries of complex legal terms using Hugging Face Transformers. Scales via n8n workflows and FAISS vector search for accessible legal transparency.',
    color: 'from-emerald-500/30 to-teal-500/30',
    repoUrl: 'https://github.com/pranavv1210/Terms-and-Conditions-Summarizer-using-n8n'
  },
  {
    title: 'Student Mental Health Analytics',
    category: 'Python • MySQL • Pandas',
    desc: 'Advanced data analysis pipeline tracking correlations between demographics and mental health. Includes ETL scripts and normalized relational SQL schemas with complex aggregation.',
    color: 'from-orange-500/30 to-red-500/30',
    repoUrl: 'https://github.com/pranavv1210/Student-Mental-Health-Analysis-SQL'
  }
]

export default function Projects() {
  return (
    <section className="relative bg-transparent py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight drop-shadow-sm">
            Selected Work
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group relative rounded-3xl p-[1px] overflow-hidden"
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${proj.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out`} 
              />
              
              <div className="relative h-full w-full bg-[#1a1a1a]/40 backdrop-blur-2xl rounded-3xl p-10 lg:p-12 border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between min-h-[400px]">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-[0.1em]">{proj.category}</p>
                  <h3 className="text-3xl font-bold text-white mb-6 tracking-tight leading-snug">{proj.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{proj.desc}</p>
                  {proj.title.includes('JourneySync') && <ArchitectureDiagram type="journeysync" />}
                  {proj.title.includes('AI Resume') && <ArchitectureDiagram type="ai-resume" />}
                  {proj.title.includes('T&C') && <ArchitectureDiagram type="tc-summarizer" />}
                  {proj.title.includes('Mental Health') && <ArchitectureDiagram type="mental-health" />}
                </div>
                
                <div className="flex gap-6 mt-12">
                  <a 
                    href={proj.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide z-10"
                  >
                    <FiGithub size={20} />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="https://github.com/pranavv1210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-purple-500/50 text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] group"
          >
            <FiGithub className="scale-110 group-hover:scale-125 transition-transform" />
            <span className="font-semibold tracking-wide">View More on GitHub</span>
            <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

