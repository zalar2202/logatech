"use client";

import ServiceCard, { DesignIcon, DevelopIcon, DeployIcon, MaintainIcon } from "./ServiceCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Services - Premium Services Section (Homepage 5 Inspired)
 */
export default function Services() {
    const { ref, isVisible } = useScrollAnimation();

    const services = [
        {
            icon: <DesignIcon />,
            title: "Strategic Design",
            href: "/services/design",
            description:
                "Beautiful, intuitive interfaces that capture your brand essence and delight your users. From wireframes to polished UI, we craft experiences that stand out.",
        },
        {
            icon: <DevelopIcon />,
            title: "Expert Development",
            href: "/services/develop",
            description:
                "Clean, scalable code built with modern technologies. Whether it's a marketing site, web app, or custom platform, we build it right.",
        },
        {
            icon: <DeployIcon />,
            title: "Cloud Deployment",
            href: "/services/deploy",
            description:
                "Seamless launch with proper hosting, domain setup, and optimization. We handle the technical details so you can focus on your business.",
        },
        {
            icon: <MaintainIcon />,
            title: "Continuous Care",
            href: "/services/maintain",
            description:
                "Ongoing support, updates, and improvements to keep your digital presence running smoothly. We're with you for the long haul.",
        },
    ];

    return (
        <section id="services" className="section-premium-services">
            <div className="container">
                <div ref={ref} className={`services-header-premium ${isVisible ? "animate-fade-in" : ""}`}>
                    <span className="premium-subtitle">What We Excel At</span>
                    <h2 className="premium-h2 text-center mt-2">Comprehensive <span className="title-serif italic">Digital Engineering</span></h2>
                    <p className="premium-subtitle-text max-w-2xl mx-auto text-center mt-6">
                        We offer more than just services; we provide solutions that transform
                        how you do business in the digital age.
                    </p>
                </div>

                <div className="services-grid-premium mt-16">
                    {services.map((service, index) => (
                        <div key={index} className={`service-item-wrapper ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${index * 150}ms` }}>
                            <ServiceCard
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                href={service.href}
                                delay={0} // Managed by wrapper now
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

