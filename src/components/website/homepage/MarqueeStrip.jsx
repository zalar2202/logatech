"use client";

import { useEffect, useRef } from "react";

/**
 * MarqueeStrip — Continuous scrolling text banner (a la Homepage 5 design)
 * Displays repeating text that scrolls infinitely.
 */
export default function MarqueeStrip() {
    const stripRef = useRef(null);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const items = [
        "Design", "Develop", "Deploy", "Maintain",
        "Design", "Develop", "Deploy", "Maintain",
        "Design", "Develop", "Deploy", "Maintain",
    ];

    return (
        <section className="marquee-section" ref={stripRef}>
            <div className="marquee-track">
                <div className="marquee-content">
                    {items.map((item, i) => (
                        <span key={`a-${i}`} className="marquee-item">
                            {item}
                            <span className="marquee-dot">✦</span>
                        </span>
                    ))}
                </div>
                <div className="marquee-content" aria-hidden="true">
                    {items.map((item, i) => (
                        <span key={`b-${i}`} className="marquee-item">
                            {item}
                            <span className="marquee-dot">✦</span>
                        </span>
                    ))}
                </div>
            </div>
            <div className="marquee-track marquee-track-reverse">
                <div className="marquee-content">
                    {items.map((item, i) => (
                        <span key={`c-${i}`} className="marquee-item marquee-item-outline">
                            {item}
                            <span className="marquee-dot">✦</span>
                        </span>
                    ))}
                </div>
                <div className="marquee-content" aria-hidden="true">
                    {items.map((item, i) => (
                        <span key={`d-${i}`} className="marquee-item marquee-item-outline">
                            {item}
                            <span className="marquee-dot">✦</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
