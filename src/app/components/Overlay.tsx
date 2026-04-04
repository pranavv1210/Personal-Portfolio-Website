'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'

export default function Overlay({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Map scroll progress to opacity and parallax offset

  // Section 1 (0% to 25% scroll) completely fades to 0
  const opacity1 = useTransform(scrollProgress, [0, 0.2, 0.25, 1], [1, 1, 0, 0])
  const y1 = useTransform(scrollProgress, [0, 0.25], ['0vh', '-10vh'])
  const display1 = useTransform(scrollProgress, [0, 0.26, 0.27, 1], ['flex', 'flex', 'none', 'none'])

  // Section 2 (25% to 60% scroll)
  const opacity2 = useTransform(scrollProgress, [0, 0.24, 0.25, 0.3, 0.55, 0.6, 0.61, 1], [0, 0, 0, 1, 1, 0, 0, 0])
  const y2 = useTransform(scrollProgress, [0, 0.25, 0.6], ['10vh', '10vh', '-10vh'])
  const display2 = useTransform(scrollProgress, [0, 0.23, 0.24, 0.61, 0.62, 1], ['none', 'none', 'flex', 'flex', 'none', 'none'])

  // Section 3 (55% to 100% scroll) - does not fade out, stays solid until naturally scrolled past
  const opacity3 = useTransform(scrollProgress, [0, 0.54, 0.55, 0.6, 1], [0, 0, 0, 1, 1])
  const y3 = useTransform(scrollProgress, [0, 0.55, 1], ['10vh', '10vh', '-10vh'])
  const display3 = useTransform(scrollProgress, [0, 0.53, 0.54, 1], ['none', 'none', 'flex', 'flex'])

  // Switch to `textShadow` instead of drop-shadow filter to prevent Webkit/Blink ghosting bug on opacity
  const shadowStyle = { textShadow: '0px 4px 20px rgba(0,0,0,0.9)' }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-8 overflow-hidden">
      <div className="relative w-full h-full max-w-7xl mx-auto">
        
        {/* Section 1: Center */}
        <motion.div 
          style={{ opacity: opacity1, y: y1, display: display1 }}
          className="absolute inset-x-0 top-[40%] flex flex-col items-center justify-center text-center will-change-transform"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight" style={shadowStyle}>
            Pranav V
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-3xl text-gray-200 font-semibold max-w-xl leading-relaxed px-4" style={shadowStyle}>
            Emerging AI & ML Engineer.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 pointer-events-auto">
            <a 
              href="/Pranav_V_Resume.pdf" 
              download
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-md border border-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] w-full sm:w-auto"
            >
              Download Resume
            </a>
          </div>
        </motion.div>

        {/* Section 2: Left aligned */}
        <motion.div 
          style={{ opacity: opacity2, y: y2, display: display2 }}
          className="absolute inset-y-0 left-0 flex items-center justify-start text-left max-w-2xl px-4 md:px-0 will-change-transform"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight" style={shadowStyle}>
            I build <span className="text-amber-500">transformative AI applications.</span>
          </h2>
        </motion.div>

        {/* Section 3: Right aligned */}
        <motion.div 
          style={{ opacity: opacity3, y: y3, display: display3 }}
          className="absolute inset-y-0 right-0 flex items-center justify-end text-right max-w-3xl px-4 md:px-0 will-change-transform"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight" style={shadowStyle}>
            Bridging <br />
            <span className="text-sky-400">data science and full-stack engineering.</span>
          </h2>
        </motion.div>

      </div>
    </div>
  )
}
