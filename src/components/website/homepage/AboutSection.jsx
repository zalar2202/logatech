"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * AboutSection - "Who We Are" section
 */
export default function AboutSection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="about" className="section about-section">
            <div ref={ref} className={`about-content ${isVisible ? "visible" : ""}`}>
                <h2 className="section-title">Who We Are</h2>
                <div className="about-text">
                    <p>
                        We're a digital studio dedicated to crafting exceptional web experiences.
                        From startups finding their footing to established businesses seeking
                        growth, we partner with ambitious teams who value quality and lasting
                        relationships.
                    </p>
                    <p>
                        Our approach is simple: understand deeply, design thoughtfully, build
                        carefully, and support continuously. We don't just deliver projects — we
                        build partnerships that evolve with your business.
                    </p>
                </div>
            </div>
        </section>
    );
}
