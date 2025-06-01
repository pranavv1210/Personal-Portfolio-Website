import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import projects from '../projects.json';

function ProjectGallery() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, 400);

    // Create 3D cards
    const cardGroup = new THREE.Group();
    projects.forEach((project, index) => {
      const geometry = new THREE.PlaneGeometry(2, 1.33);
      const material = new THREE.MeshBasicMaterial({
        color: 0x1F2A44,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
      });
      const card = new THREE.Mesh(geometry, material);
      card.position.x = index * 3 - (projects.length - 1) * 1.5;
      card.userData = { project };
      cardGroup.add(card);
    });
    scene.add(cardGroup);

    camera.position.z = 5;

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      cardGroup.rotation.y += (mouseX - cardGroup.rotation.y) * 0.05;
      cardGroup.rotation.x += (mouseY - cardGroup.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = -(event.clientY / 400 - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Click to show project details
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / 400) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardGroup.children);
      if (intersects.length > 0 && cardRef.current) {
        const project = intersects[0].object.userData.project;
        cardRef.current.innerHTML = `
          <h3 class="text-xl font-bold text-bright-cyan">${project.title}</h3>
          <p class="text-light-silver mt-2">${project.description}</p>
          <div class="mt-2">
            <p class="text-bright-cyan font-semibold">Tech Stack:</p>
            <p class="text-light-silver">${project.techStack.join(', ')}</p>
          </div>
        `;
        cardRef.current.classList.add('active');
      } else if (cardRef.current) {
        cardRef.current.classList.remove('active');
      }
    };
    canvas.addEventListener('click', onClick);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 400);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="gallery-canvas" />
      <div ref={cardRef} className="project-card" style={{ top: '50%', left: '50%' }} />
    </div>
  );
}

export default ProjectGallery;