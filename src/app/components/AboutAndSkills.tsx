'use client'

import { motion } from 'framer-motion'
import { FiCode, FiDatabase, FiCloud, FiActivity, FiTerminal } from 'react-icons/fi'

const skills = [
  {
    category: "Languages & Frameworks",
    icon: <FiCode size={20} />,
    items: ["Python", "Java", "React.js", "HTML", "SQL"]
  },
  {
    category: "AI & Machine Learning",
    icon: <FiActivity size={20} />,
    items: ["TensorFlow", "OpenCV", "NLP", "OpenAI", "LLMs"]
  },
  {
    category: "Data & Tools",
    icon: <FiDatabase size={20} />,
    items: ["Pandas", "PowerBI", "Tableau", "Jupyter", "Excel"]
  },
  {
    category: "Platforms & Other",
    icon: <FiCloud size={20} />,
    items: ["Azure", "Android Studio", "Git", "GitHub"]
  }
]

export default function AboutAndSkills() {
  return (
    <section className="relative bg-transparent py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 relative">
        
        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            About Me
          </h2>
          <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
            <p>
              I'm a 21-year-old Machine Learning enthusiast based in Bengaluru, currently pursuing my B.E. in Artificial Intelligence and Machine Learning at CMR Institute of Technology.
            </p>
            <p>
              Skilled in Python, SQL, and full-stack development using React. I have practical experience in building data science pipelines and implementing machine learning algorithms.
            </p>
            <p>
              I am passionate about leveraging AI to solve real-world challenges, with a strong foundation in deep learning, generative models, and applied AI research. My goal is to build intelligent systems that drive meaningful impact.
            </p>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skillGroup, idx) => (
              <div 
                key={idx}
                className="bg-[#121212] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4 text-purple-400">
                  {skillGroup.icon}
                  <h3 className="text-white font-semibold">{skillGroup.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full border border-white/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
