"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * TechStack - Display technologies and tools used
 */
export default function TechStack() {
    const { ref, isVisible } = useScrollAnimation();

    const technologies = [
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "Node.js", icon: "🟢" },
        { name: "WordPress", icon: "📝" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "MongoDB", icon: "🍃" },
        { name: "AWS", icon: "☁️" },
        { name: "Docker", icon: "🐳" },
        { name: "Figma", icon: "🎨" },
        { name: "Git", icon: "📊" },
    ];

    return (
        <section id="tech" className="section tech-section">
            <h2 className="section-title">Tools & Technologies</h2>
            <p className="section-subtitle">Modern tools for modern solutions</p>
            <div ref={ref} className={`tech-grid ${isVisible ? "visible" : ""}`}>
                {technologies.map((tech, index) => (
                    <div
                        key={tech.name}
                        className="tech-item"
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        <span className="tech-icon">{tech.icon}</span>
                        <span className="tech-name">{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
