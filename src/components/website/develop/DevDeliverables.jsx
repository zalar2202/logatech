"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const deliverables = [
    {
        icon: "💻",
        title: "Full Source Code",
        description:
            "Complete Git repository functionality. You own 100% of the code — no lock-in.",
    },
    {
        icon: "🌐",
        title: "Live Application",
        description: "Fully deployed and optimized application on your preferred cloud provider.",
    },
    {
        icon: "🔒",
        title: "Secure Configs",
        description: "Environment variables and security headers configured for production safety.",
    },
    {
        icon: "📘",
        title: "Technical Docs",
        description: "README instructions, API documentation, and architecture diagrams.",
    },
    {
        icon: "🔄",
        title: "CI/CD Pipelines",
        description: "Automated build and deploy workflows for smooth future updates.",
    },
];

/**
 * DevDeliverables - What clients receive section for Develop page
 */
export default function DevDeliverables() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="deliverables" className="section deliverables-section">
            <h2 className="section-title">What You Get</h2>
            <p className="section-subtitle">
                Tangible assets — complete ownership and professional setup
            </p>
            <div ref={ref} className={`deliverables-grid ${isVisible ? "visible" : ""}`}>
                {deliverables.map((item, index) => (
                    <div
                        key={index}
                        className="deliverable-card loga-card"
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <span className="deliverable-icon">{item.icon}</span>
                        <h3 className="deliverable-title">{item.title}</h3>
                        <p className="deliverable-description">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
