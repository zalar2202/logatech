"use client";

import ServiceCard, { DesignIcon, DevelopIcon, DeployIcon, MaintainIcon } from "./ServiceCard";

/**
 * Services - Services section with 4 pillars
 */
export default function Services() {
    const services = [
        {
            icon: <DesignIcon />,
            title: "Design",
            href: "/services/design",
            description:
                "Beautiful, intuitive interfaces that capture your brand essence and delight your users. From wireframes to polished UI, we craft experiences that stand out.",
        },
        {
            icon: <DevelopIcon />,
            title: "Develop",
            href: "/services/develop",
            description:
                "Clean, scalable code built with modern technologies. Whether it's a marketing site, web app, or custom platform, we build it right.",
        },
        {
            icon: <DeployIcon />,
            title: "Deploy",
            href: "/services/deploy",
            description:
                "Seamless launch with proper hosting, domain setup, and optimization. We handle the technical details so you can focus on your business.",
        },
        {
            icon: <MaintainIcon />,
            title: "Maintain",
            href: "/services/maintain",
            description:
                "Ongoing support, updates, and improvements to keep your digital presence running smoothly. We're with you for the long haul.",
        },
    ];

    return (
        <section id="services" className="section services-section">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">
                A comprehensive suite of services to bring your vision to life
            </p>
            <div className="services-grid">
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        href={service.href}
                        delay={index * 100}
                    />
                ))}
            </div>
        </section>
    );
}
