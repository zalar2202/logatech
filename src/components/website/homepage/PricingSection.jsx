"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * PricingSection — Three-tier pricing cards inspired by Homepage 5
 */
export default function PricingSection() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const plans = [
        {
            name: "Starter",
            price: "499",
            period: "project",
            description: "Perfect for small businesses and MVPs getting started online.",
            features: [
                "Single page website or landing page",
                "Responsive mobile-first design",
                "Basic SEO setup",
                "Contact form integration",
                "2 rounds of revisions",
                "1 month free support",
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Professional",
            price: "1,499",
            period: "project",
            description: "Ideal for growing businesses that need a full digital presence.",
            features: [
                "Multi-page custom website (up to 8 pages)",
                "Advanced UI/UX design with animations",
                "Full SEO optimization & analytics",
                "CMS integration (content management)",
                "E-commerce ready (up to 50 products)",
                "3 months free support & maintenance",
            ],
            cta: "Most Popular",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For established businesses needing complex, scalable solutions.",
            features: [
                "Custom web application development",
                "API integrations & microservices",
                "Advanced security & performance",
                "Dedicated project manager",
                "Priority 24/7 support",
                "Ongoing maintenance & updates",
            ],
            cta: "Contact Us",
            popular: false,
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section pricing-section" id="pricing" ref={sectionRef}>
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">
                Transparent pricing for every stage of your business journey
            </p>
            <div className="pricing-grid">
                {plans.map((plan, i) => (
                    <div
                        key={plan.name}
                        className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""} ${isVisible ? "pricing-card-visible" : ""}`}
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        {plan.popular && (
                            <div className="pricing-badge">Most Popular</div>
                        )}
                        <h3 className="pricing-plan-name">{plan.name}</h3>
                        <p className="pricing-description">{plan.description}</p>
                        <div className="pricing-price">
                            {plan.price !== "Custom" && <span className="pricing-currency">$</span>}
                            <span className="pricing-amount">{plan.price}</span>
                            {plan.period && <span className="pricing-period">/ {plan.period}</span>}
                        </div>
                        <Link
                            href="/login"
                            className={`pricing-cta ${plan.popular ? "pricing-cta-primary" : "pricing-cta-secondary"}`}
                        >
                            {plan.cta}
                        </Link>
                        <ul className="pricing-features">
                            {plan.features.map((feature) => (
                                <li key={feature} className="pricing-feature">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="pricing-check"
                                    >
                                        <path
                                            d="M4 8L7 11L12 5"
                                            stroke={plan.popular ? "var(--color-primary)" : "var(--color-text-secondary)"}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
