"use client";

import ParticleBackground from "./ParticleBackground";
import Link from "next/link";

/**
 * Hero - Landing page hero section with particle background
 */
export default function Hero() {
    const handleContactClick = (e) => {
        e.preventDefault();
        const element = document.getElementById("contact");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="hero" id="hero">
            <ParticleBackground />
            <div className="hero-content">
                <h1 className="hero-title animate-fade-in">LogaTech</h1>
                <div className="hero-tagline">
                    <Link
                        href="/services/design"
                        className="animate-fade-in-up hover-link"
                    >
                        Design
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/develop"
                        className="animate-fade-in-up delay-100 hover-link"
                    >
                        Develop
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/deploy"
                        className="animate-fade-in-up delay-200 hover-link"
                    >
                        Deploy
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/maintain"
                        className="animate-fade-in-up delay-300 hover-link"
                    >
                        Maintain
                    </Link>
                </div>
                <p className="hero-description animate-fade-in-up delay-400">
                    From Code to Cloud — Your end-to-end digital partner. We design, build, and grow
                    your online presence with expert care.
                </p>
                <div className="hero-cta animate-fade-in-up delay-500">
                    <Link href="#contact" className="loga-btn" onClick={handleContactClick}>
                        Let&apos;s Talk
                    </Link>
                    <a href="#services" className="loga-alt-btn">
                        Explore Services
                    </a>
                </div>
            </div>
        </section>
    );
}
