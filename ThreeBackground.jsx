// components/ThreeBackground.jsx
"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Escena, cámara y renderer
    const scene   = new THREE.Scene();
    const camera  = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    } catch (err) {
      console.warn("WebGL no disponible, se omite fondo 3D", err);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ---- Partículas ----
    const geometry  = new THREE.SphereGeometry(0.1, 24, 24);
    const particles = [];

    for (let i = 0; i < 200; i++) {
      // Color HSL aleatorio (tonos vibrantes)
      const hue        = Math.random();           // 0-1 -> 0-360°
      const saturation = 0.6 + Math.random() * 0.4; // 0.6-1
      const lightness  = 0.45 + Math.random() * 0.2; // 0.45-0.65
      const color      = new THREE.Color().setHSL(hue, saturation, lightness);

      const material   = new THREE.MeshStandardMaterial({ color });
      const particle   = new THREE.Mesh(geometry, material);

      particle.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      scene.add(particle);
      particles.push(particle);
    }

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 20;

    // Interacción de mouse
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Animación
    const animate = () => {
      const t = Date.now() * 0.001;
      particles.forEach((p) => {
        p.position.x += Math.sin(p.position.y + t) * 0.005;
        p.position.y += Math.cos(p.position.x + t) * 0.005;
      });

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Limpieza
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="background"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,           // recuerda envolver tu contenido con z-10
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeBackground;
