"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pricingTiers = [
    {
        type: "Marketing / Landing Page",
        startingFrom: "$1,000",
        range: "$1,000 – $2,500",
    },
    {
        type: "Custom Content Site (CMS)",
        startingFrom: "$2,500",
        range: "$2,500 – $5,000",
    },
    {
        type: "Web Application (MVP)",
        startingFrom: "$5,000",
        range: "$5,000 – $10,000",
    },
    {
        type: "Full SaaS / Platform",
        startingFrom: "$10,000+",
        range: "$10,000 – $25,000+",
    },
];

const pricingFactors = [
    "Functionality complexity (Auth, Payments)",
    "Third-party API integrations",
    "Data migration needs",
    "Real-time features (Chat, Notifications)",
];

/**
 * DevPricing - Investment overview section for Develop page
 */
export default function DevPricing() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="section pricing-section">
            <h2 className="section-title">💰 Investment Overview</h2>
            <p className="section-subtitle">
                Competitive rates for high-quality engineering
            </p>
            <div ref={ref} className={`pricing-content ${isVisible ? "visible" : ""}`}>
                <div className="pricing-table-wrapper">
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Project Type</th>
                                <th>Starting From</th>
                                <th>Typical Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricingTiers.map((tier, index) => (
                                <tr key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <td className="pricing-type">{tier.type}</td>
                                    <td className="pricing-starting">{tier.startingFrom}</td>
                                    <td className="pricing-range">{tier.range}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pricing-factors">
                    <h3 className="pricing-factors-title">What affects pricing?</h3>
                    <ul className="pricing-factors-list">
                        {pricingFactors.map((factor, index) => (
                            <li key={index}>✓ {factor}</li>
                        ))}
                    </ul>
                </div>

                <div className="pricing-note">
                    <p>
                        💡 Code quality matters. We build cleanly to save you maintenance costs
                        down the road.
                    </p>
                </div>

                <div className="pricing-cta">
                    <a href="#contact" className="loga-btn">
                        Get a Technical Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
