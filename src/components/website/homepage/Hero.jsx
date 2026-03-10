"use client";

import ParticleBackground from "./ParticleBackground";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe, Settings } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Hero - Premium Landing Page Hero with two-column Spline 3D layout
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
                <div className="hero-two-col">

                    {/* Left: Text Content */}
                    <div className="hero-text-col">
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

                        {/* Service Tags */}
                        <div className="hero-services-staggered hero-services-left">
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
                        <div className="hero-cta-group hero-cta-left animate-fade-in-up delay-600">
                            <Link href="#contact" className="premium-btn-primary" onClick={handleContactClick}>
                                <span>Start Your Journey</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="#services" className="premium-btn-outline">
                                <span>Explore Our Services</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Spline 3D Scene */}
                    <div className="hero-spline-col">
                        <SplineScene
                            scene={SPLINE_SCENE}
                            className="w-full h-full"
                        />
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
