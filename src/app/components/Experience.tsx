'use client'

import { motion } from 'framer-motion'

export default function Experience() {
  return (
    <section className="relative bg-transparent py-24 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 z-10 relative">
        
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
            <span className="text-purple-500">◆</span> Education
          </h2>
          <div className="space-y-8">
            <div className="relative pl-6 border-l border-white/10">
              <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p className="text-sm text-purple-400 font-medium mb-1">Expected 2026</p>
              <h3 className="text-xl font-bold text-white">B.E. in Artificial Intelligence & ML</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">CMR Institute of Technology, Bengaluru.<br/>CGPA: 8.51</p>
            </div>
            <div className="relative pl-6 border-l border-white/10">
              <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p className="text-sm text-purple-400 font-medium mb-1">2022</p>
              <h3 className="text-xl font-bold text-white">Pre-University Course - Science (PCMB)</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">St Joseph's Pre University College, Bengaluru.<br/>Score: 83.3%</p>
            </div>
            <div className="relative pl-6 border-l border-white/10">
              <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p className="text-sm text-purple-400 font-medium mb-1">2020</p>
              <h3 className="text-xl font-bold text-white">10th Grade – ICSE</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">Cambridge School, Bengaluru.<br/>Score: 81.8%</p>
            </div>
          </div>
        </motion.div>

        {/* Experience & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
            <span className="text-blue-500">◆</span> Experience
          </h2>
          <div className="space-y-8">
            <div className="relative pl-6 border-l border-white/10">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <p className="text-sm text-blue-400 font-medium mb-1">Jan 2026 – May 2026</p>
              <h3 className="text-xl font-bold text-white">Data Scientist Intern</h3>
              <p className="text-gray-300 font-medium mt-1">Cheerans Global Solutions Pvt Ltd.</p>
              <p className="text-gray-400 mt-2 leading-relaxed">
                Designed and implemented the frontend for a cafe billing software. Executed data analysis, cleaning, and built interactive dashboards.
              </p>
            </div>
            

          </div>
        </motion.div>

      </div>
    </section>
  )
}
