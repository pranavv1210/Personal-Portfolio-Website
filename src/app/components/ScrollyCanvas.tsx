'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import Overlay from './Overlay'

// According to the image sequence naming frame_000 to frame_098, it's 99 frames
const TOTAL_FRAMES = 99

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      const idx = String(i).padStart(3, '0')
      img.src = `/sequence/frame_${idx}_delay-0.066s.webp`
      
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = loadedImages
          setIsLoaded(true)
          // Initially render frame 0 once
          // We must defer to let React state commit if needed, or simply render
          setTimeout(() => renderFrame(0), 100)
        }
      }
      loadedImages.push(img)
    }
  }, [])

  const renderFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return
    const context = canvasRef.current.getContext('2d')
    if (!context) return
    
    const canvas = canvasRef.current
    const img = imagesRef.current[index]

    // Maintain object-fit: cover aspect ratio calculation
    const imgAspectRatio = img.width / img.height
    const canvasAspectRatio = canvas.width / canvas.height
    
    // Zoom by 8% to crop out the "Veo" watermark on the bottom right corner
    const ZOOM_FACTOR = 1.08

    let renderableWidth, renderableHeight, xStart, yStart
    if (imgAspectRatio < canvasAspectRatio) {
      renderableWidth = canvas.width * ZOOM_FACTOR
      renderableHeight = (canvas.width / imgAspectRatio) * ZOOM_FACTOR
    } else {
      renderableHeight = canvas.height * ZOOM_FACTOR
      renderableWidth = (canvas.height * imgAspectRatio) * ZOOM_FACTOR
    }

    xStart = (canvas.width - renderableWidth) / 2
    yStart = (canvas.height - renderableHeight) / 2

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight)
  }

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Set canvas to exactly window bounds for high dpi (retina) scaling if necessary.
        // For performance, simple window inner width/height usually suffice on requestAnimationFrame
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        
        const currentFrame = Math.floor(scrollYProgress.get() * (TOTAL_FRAMES - 1))
        renderFrame(currentFrame)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  // Update canvas on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
    )
    requestAnimationFrame(() => renderFrame(frameIndex))
  })

  // We set an 800vh container to make the scroll sequence much longer so text is readable
  return (
    <div ref={containerRef} className="relative w-full h-[800vh] bg-[#121212]">
      {/* Sticky inside container locks the view and acts as the "viewport" */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* The canvas sits here, absolute fill */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block bg-[#121212]" 
        />
        {/* Parallax text sits above */}
        <Overlay scrollProgress={scrollYProgress} />
      </div>
    </div>
  )
}
