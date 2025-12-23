'use client';

import Amenities from '@/components/custom/Amenities';
import BookingForm from '@/components/custom/BookingForm';
import Contact from '@/components/custom/Contact';
import Dining from '@/components/custom/Dining';
import Footer from '@/components/custom/Footer';
import Gallery from '@/components/custom/Gallery';
import Hero from '@/components/custom/Hero';
import Navigation from '@/components/custom/Navigation';
import Rooms from '@/components/custom/Rooms';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(117, 112, 188, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollY={scrollY} />
      <Hero canvasRef={canvasRef} />
      <Rooms />
      <Dining />
      <Amenities />
      <Gallery/>
      <BookingForm />
      <Contact />
      <Footer />
    </div>
  );
}