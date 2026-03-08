"use client";

import { CheckCircle2, Award, Zap, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * AboutSection - Premium Vision & Experience (Homepage 5 Inspired)
 */
export default function AboutSection() {
    const { ref, isVisible } = useScrollAnimation();

    const highlights = [
        { icon: <Award className="w-5 h-5" />, title: "Award Winning", text: "Recognized for creative excellence" },
        { icon: <Zap className="w-5 h-5" />, title: "Agile Process", text: "Fast iterations, rapid delivery" },
        { icon: <CheckCircle2 className="w-5 h-5" />, title: "Quality First", text: "Pixel-perfect, bug-free code" },
        { icon: <Heart className="w-5 h-5" />, title: "People Centric", text: "Built for users, loved by humans" },
    ];

    return (
        <section id="about" className="section-premium-about">
            <div className="container">
                <div ref={ref} className={`about-grid-premium ${isVisible ? "visible" : ""}`}>
                    {/* Left Side: Content */}
                    <div className="about-col-left animate-slide-in-left">
                        <div className="section-header-compact text-left">
                            <span className="premium-subtitle">Our Vision</span>
                            <h2 className="premium-h2 mt-2">Crafting the Future of the <span className="title-serif italic">Digital World</span></h2>
                        </div>

                        <div className="about-text-premium mt-6">
                            <p>
                                At Logatech, we don&apos;t just follow trends—we set them. Our team of
                                visionary designers and expert engineers work in harmony to
                                bridge the gap between imagination and reality.
                            </p>
                            <p className="mt-4">
                                We believe every line of code should serve a purpose, and every pixel
                                should evoke emotion. Your success is our mission, and we stop
                                at nothing to deliver brilliance.
                            </p>

                            <div className="experience-badge-premium mt-10">
                                <div className="exp-number">10+</div>
                                <div className="exp-text">Years of Engineering <br /> excellence worldwide</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Features/Values */}
                    <div className="about-col-right animate-slide-in-right">
                        <div className="highlights-grid">
                            {highlights.map((h, i) => (
                                <div key={i} className="highlight-card-premium group">
                                    <div className="highlight-icon-wrapper">
                                        {h.icon}
                                    </div>
                                    <h3 className="highlight-title-premium">{h.title}</h3>
                                    <p className="highlight-text-premium">{h.text}</p>
                                    <div className="highlight-hover-border"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

