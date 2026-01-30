"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pricingTiers = [
    {
        type: "Personal / Portfolio",
        startingFrom: "$800",
        range: "$800 – $1,500",
    },
    {
        type: "Business Brochure",
        startingFrom: "$1,200",
        range: "$1,200 – $2,500",
    },
    {
        type: "E-commerce / WooCommerce",
        startingFrom: "$2,000",
        range: "$2,000 – $4,000",
    },
    {
        type: "Custom Web Application",
        startingFrom: "$3,000",
        range: "$3,000 – $8,000+",
    },
];

const pricingFactors = [
    "Number of pages/screens",
    "Custom illustrations or graphics",
    "Complexity of interactions",
    "Timeline requirements",
];

/**
 * PricingGuidance - Investment overview section
 */
export default function PricingGuidance() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="section pricing-section">
            <h2 className="section-title">💰 Investment Overview</h2>
            <p className="section-subtitle">Transparent pricing to help you plan your project</p>
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
                        💡 Every project is unique. We provide a transparent quote after
                        understanding your needs — no hidden fees, no surprises.
                    </p>
                </div>

                <div className="pricing-cta">
                    <a href="#contact" className="loga-btn">
                        Get a Custom Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
