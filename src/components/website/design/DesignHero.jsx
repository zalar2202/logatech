"use client";

/**
 * DesignHero - Hero section for Design service page
 */
export default function DesignHero() {
    return (
        <section className="design-hero" id="design-hero">
            <div className="design-hero-content animate-fade-in">
                <div className="design-hero-badge animate-fade-in-up delay-100">
                    <span>✦ Design Services</span>
                </div>
                <h1 className="design-hero-title animate-fade-in-up delay-200">
                    Design Websites That
                    <span className="highlight"> Serve Your Business</span>
                </h1>
                <p className="design-hero-subtitle animate-fade-in-up delay-300">
                    Beautiful, Strategic, Built for Growth
                </p>
                <p className="design-hero-description animate-fade-in-up delay-400">
                    We don't just make things look good — we design experiences that elevate your
                    brand, communicate your message, and convert visitors into customers.
                </p>
                <div className="design-hero-cta animate-fade-in-up delay-500">
                    <a href="#contact" className="loga-btn">
                        Start Your Design Strategy →
                    </a>
                    <a href="#use-cases" className="loga-alt-btn">
                        See Examples
                    </a>
                </div>
            </div>
        </section>
    );
}
