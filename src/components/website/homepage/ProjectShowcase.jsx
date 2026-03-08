"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * ProjectShowcase — Recent work / blog cards inspired by Homepage 5's project section
 */
export default function ProjectShowcase() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const projects = [
        {
            date: "March 2026",
            title: "Modern E-Commerce Platform with AI-Powered Recommendations",
            description:
                "Built a scalable online store with personalized product suggestions, real-time inventory, and seamless checkout flow.",
            author: "LogaTech Team",
            category: "Full-Stack",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            date: "February 2026",
            title: "SaaS Analytics Dashboard for Marketing Agencies",
            description:
                "Designed and developed a real-time analytics platform with custom widgets, data visualization, and team collaboration tools.",
            author: "LogaTech Team",
            category: "Web App",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        {
            date: "January 2026",
            title: "Healthcare Patient Portal with HIPAA Compliance",
            description:
                "Created a secure patient management system with appointment scheduling, medical records, and video consultations.",
            author: "LogaTech Team",
            category: "Enterprise",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section project-showcase-section" ref={sectionRef}>
            <h2 className="section-title">Recent Work</h2>
            <p className="section-subtitle">
                Explore our latest projects and see how we bring ideas to life
            </p>
            <div className="project-showcase-grid">
                {projects.map((project, i) => (
                    <div
                        key={project.title}
                        className={`project-showcase-card ${isVisible ? "project-showcase-visible" : ""}`}
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        <div
                            className="project-showcase-accent"
                            style={{ background: project.gradient }}
                        />
                        <div className="project-showcase-content">
                            <div className="project-showcase-meta">
                                <span className="project-showcase-date">{project.date}</span>
                                <span className="project-showcase-category">{project.category}</span>
                            </div>
                            <h3 className="project-showcase-title">
                                <Link href="/login">{project.title}</Link>
                            </h3>
                            <p className="project-showcase-desc">{project.description}</p>
                            <div className="project-showcase-footer">
                                <Link href="/login" className="project-showcase-link">
                                    <span>Learn More</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M3 8H13M13 8L9 4M13 8L9 12"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                                <span className="project-showcase-author">
                                    <span className="project-showcase-avatar">L</span>
                                    {project.author}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
