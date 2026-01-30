"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * ValueCard - Individual value proposition card
 */
function ValueCard({ icon, title, description, delay = 0 }) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`value-card loga-card ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="value-icon">{icon}</div>
            <h3 className="value-title">{title}</h3>
            <p className="value-description">{description}</p>
        </div>
    );
}

/**
 * WhyLoga - Value proposition section
 */
export default function WhyLoga() {
    const values = [
        {
            icon: "🎯",
            title: "All-in-One Partner",
            description:
                "Design, development, and deployment under one roof. No more juggling between agencies — we handle everything.",
        },
        {
            icon: "🚀",
            title: "End-to-End Ownership",
            description:
                "From your first idea to launch day and beyond. We take full ownership of your project's success.",
        },
        {
            icon: "🤝",
            title: "Long-Term Mindset",
            description:
                "We're not just vendors, we're partners. We grow with your business and adapt as your needs evolve.",
        },
    ];

    return (
        <section id="why-us" className="section why-section">
            <h2 className="section-title">Why Choose Loga Tech?</h2>
            <p className="section-subtitle">
                From Code to Cloud — More than a service provider, a true digital partner
            </p>
            <div className="values-grid">
                {values.map((value, index) => (
                    <ValueCard
                        key={index}
                        icon={value.icon}
                        title={value.title}
                        description={value.description}
                        delay={index * 150}
                    />
                ))}
            </div>
        </section>
    );
}
