"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleBackground - Canvas-based animated particle system
 * Creates a subtle, floating particle effect for the hero section
 */
export default function ParticleBackground({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let particles = [];

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.growing = Math.random() > 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Fade in/out effect
                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.7) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.1) this.growing = true;
                }

                // Wrap around screen
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                // Get computed primary color from CSS variable
                const primaryColor =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--color-primary")
                        .trim() || "#32127a";

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(primaryColor, this.opacity);
                ctx.fill();
            }
        }

        // Helper to convert hex to rgba
        function hexToRgba(hex, alpha) {
            // Handle both hex and other color formats
            if (hex.startsWith("#")) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            // Fallback for non-hex colors
            return `rgba(50, 18, 122, ${alpha})`;
        }

        // Initialize particles
        function initParticles() {
            const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // Draw connections between nearby particles
        function drawConnections() {
            const maxDistance = 150;
            const primaryColor =
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--color-primary")
                    .trim() || "#32127a";

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = hexToRgba(primaryColor, opacity);
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections first (behind particles)
            drawConnections();

            // Update and draw particles
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
            handleResize();
            window.addEventListener("resize", handleResize);
            animate();
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <canvas ref={canvasRef} className={`particle-background ${className}`} aria-hidden="true" />
    );
}
