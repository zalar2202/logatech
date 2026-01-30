"use client";

/**
 * DevelopHero - Hero section for Develop service page
 */
export default function DevelopHero() {
    return (
        <section className="design-hero develop-hero" id="develop-hero">
            <div className="design-hero-content animate-fade-in">
                <div className="design-hero-badge animate-fade-in-up delay-100">
                    <span>✦ Development Services</span>
                </div>
                <h1 className="design-hero-title animate-fade-in-up delay-200">
                    Build <span className="highlight">High-Performance</span> Web Applications
                </h1>
                <p className="design-hero-subtitle animate-fade-in-up delay-300">
                    Scalable, Secure, and Future-Proof
                </p>
                <p className="design-hero-description animate-fade-in-up delay-400">
                    We transform ideas into powerful digital products. From complex web apps to
                    custom platforms, we write clean code that drives your business forward.
                </p>
                <div className="design-hero-cta animate-fade-in-up delay-500">
                    <a href="#contact" className="loga-btn">
                        Discuss Your Project →
                    </a>
                    <a href="#tech-stack" className="loga-alt-btn">
                        View Tech Stack
                    </a>
                </div>
            </div>
        </section>
    );
}
