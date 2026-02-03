"use client";

import ParticleBackground from "./ParticleBackground";
import Link from "next/link";
import SmartCTA from "@/components/website/shared/SmartCTA";

/**
 * Hero - Landing page hero section with particle background
 */
export default function Hero() {
    return (
        <section className="hero" id="hero">
            <ParticleBackground />
            <div className="hero-content animate-fade-in">
                <h1 className="hero-title">LogaTech</h1>
                <div className="hero-tagline">
                    <Link
                        href="/services/design"
                        className="animate-fade-in-up delay-100 hover-link"
                    >
                        Design
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/develop"
                        className="animate-fade-in-up delay-200 hover-link"
                    >
                        Develop
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/deploy"
                        className="animate-fade-in-up delay-300 hover-link"
                    >
                        Deploy
                    </Link>
                    <span className="hero-dot">·</span>
                    <Link
                        href="/services/maintain"
                        className="animate-fade-in-up delay-400 hover-link"
                    >
                        Maintain
                    </Link>
                </div>
                <p className="hero-description animate-fade-in-up delay-500">
                    From Code to Cloud — Your end-to-end digital partner. We design, build, and grow
                    your online presence with expert care.
                </p>
                <div className="hero-cta animate-fade-in-up delay-600">
                    <SmartCTA label="Let's Talk" className="loga-btn" />
                    <a href="#services" className="loga-alt-btn">
                        Explore Services
                    </a>
                </div>
            </div>
        </section>
    );
}
