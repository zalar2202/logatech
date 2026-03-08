"use client";

import ParticleBackground from "./ParticleBackground";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe, Settings } from "lucide-react";

/**
 * Hero - Premium Landing Page Hero (Homepage 5 Inspired)
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
        <section className="hero-premium" id="hero">
            <ParticleBackground />

            {/* Background Decorative Elements */}
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>

            <div className="hero-container container">
                <div className="hero-content-center">
                    {/* Premium Badge */}
                    <div className="hero-badge animate-fade-in">
                        <span className="badge-icon"><Sparkles className="w-4 h-4" /></span>
                        <span className="badge-text">Trusted Digital Transformation Partner</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="hero-title-main animate-fade-in-up">
                        <span className="title-regular">From Code to</span>
                        <br />
                        <span className="title-serif gradient-text">Cloud Excellence</span>
                    </h1>

                    {/* Service Tags Staggered */}
                    <div className="hero-services-staggered">
                        <div className="service-tag-item animate-fade-in-up delay-100">
                            <span className="service-dot"><Zap className="w-3 h-3" /></span>
                            <Link href="/services/design" className="hover-underline">Design</Link>
                        </div>
                        <div className="service-tag-item animate-fade-in-up delay-200">
                            <span className="service-dot"><Globe className="w-3 h-3" /></span>
                            <Link href="/services/develop" className="hover-underline">Develop</Link>
                        </div>
                        <div className="service-tag-item animate-fade-in-up delay-300">
                            <span className="service-dot"><ShieldCheck className="w-3 h-3" /></span>
                            <Link href="/services/deploy" className="hover-underline">Deploy</Link>
                        </div>
                        <div className="service-tag-item animate-fade-in-up delay-400">
                            <span className="service-dot"><Settings className="w-3 h-3" /></span>
                            <Link href="/services/maintain" className="hover-underline">Maintain</Link>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="hero-description-premium animate-fade-in-up delay-500">
                        Logatech empowers businesses with <strong>cutting-edge technology</strong> and
                        strategic digital solutions. We don&apos;t just build websites; we engineer
                        scalable ecosystems for growth.
                    </p>

                    {/* CTA Section */}
                    <div className="hero-cta-group animate-fade-in-up delay-600">
                        <Link href="#contact" className="premium-btn-primary" onClick={handleContactClick}>
                            <span>Start Your Journey</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#services" className="premium-btn-outline">
                            <span>Explore Our Services</span>
                        </Link>
                    </div>

                    {/* Floating Floating Stat Cards for "WOW" factor */}
                    <div className="hero-floating-stats">
                        <div className="floating-stat-card card-1 animate-float">
                            <div className="stat-icon-small"><Zap className="w-4 h-4" /></div>
                            <div className="stat-text">Ultra Fast Load</div>
                        </div>
                        <div className="floating-stat-card card-2 animate-float-delayed">
                            <div className="stat-icon-small"><ShieldCheck className="w-4 h-4" /></div>
                            <div className="stat-text">Security First</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-hint animate-bounce">
                <div className="mouse-wheel"></div>
                <span className="scroll-text">Scroll to explore</span>
            </div>
        </section>
    );
}

