"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CounterStats — Animated counter statistics section (Homepage 5 inspired)
 */
export default function CounterStats() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const stats = [
        { value: 150, suffix: "+", label: "Projects Delivered", color: "var(--color-primary)" },
        { value: 50, suffix: "+", label: "Happy Clients", color: "#10b981" },
        { value: 98, suffix: "%", label: "Client Retention", color: "#f59e0b" },
        { value: 5, suffix: "+", label: "Years Experience", color: "#8b5cf6" },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section counter-section" id="stats" ref={sectionRef}>
            <div className="counter-grid">
                <div className="counter-intro">
                    <h2 className="section-title" style={{ textAlign: "left" }}>
                        Numbers That Speak for Themselves
                    </h2>
                    <p style={{ color: "var(--color-text-secondary)", maxWidth: 400 }}>
                        Our track record of delivering excellence speaks louder than words.
                        Here&apos;s what we&apos;ve achieved together with our clients.
                    </p>
                </div>
                <div className="counter-cards">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`counter-card ${isVisible ? "counter-card-visible" : ""}`}
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <div className="counter-value" style={{ color: stat.color }}>
                                {isVisible ? <AnimatedNumber target={stat.value} /> : 0}
                                <span className="counter-suffix">{stat.suffix}</span>
                            </div>
                            <span className="counter-label">{stat.label}</span>
                            <div
                                className="counter-bar"
                                style={{
                                    background: stat.color,
                                    width: isVisible ? "60%" : "0%",
                                    transitionDelay: `${i * 150 + 300}ms`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AnimatedNumber({ target }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target]);

    return <>{count}</>;
}
