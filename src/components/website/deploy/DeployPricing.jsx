"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pricingTiers = [
    {
        type: "Launch Pad",
        usage: "MVPs & Small Apps",
        startingFrom: "$500",
        range: "$500 – $1,000",
    },
    {
        type: "Scale Up",
        usage: "Growing SaaS / E-commerce",
        startingFrom: "$1,500",
        range: "$1,500 – $3,000",
    },
    {
        type: "Enterprise Cluster",
        usage: "High Availability & Compliance",
        startingFrom: "$5,000",
        range: "$5,000+",
    },
];

const pricingFactors = [
    "Cloud Provider Choice (AWS vs Vercel)",
    "Infrastructure Complexity (K8s vs VPS)",
    "Compliance Requirements (HIPAA/GDPR)",
    "Traffic Volume & Load Balancing",
];

export default function DeployPricing() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="section pricing-section">
            <h2 className="section-title">💰 Infrastructure Investment</h2>
            <div ref={ref} className={`pricing-content ${isVisible ? "visible" : ""}`}>
                <div className="pricing-table-wrapper">
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Deployment Tier</th>
                                <th>Ideal For</th>
                                <th>Setup Cost (One-time)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricingTiers.map((tier, index) => (
                                <tr key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <td className="pricing-type">{tier.type}</td>
                                    <td>{tier.usage}</td>
                                    <td className="pricing-starting">{tier.startingFrom}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pricing-factors">
                    <h3 className="pricing-factors-title">What affects deployment costs?</h3>
                    <ul className="pricing-factors-list">
                        {pricingFactors.map((factor, index) => (
                            <li key={index}>✓ {factor}</li>
                        ))}
                    </ul>
                </div>

                <div className="pricing-note">
                    <p>
                        <strong>Note on Cloud Costs:</strong> The prices above are for our engineering setup services. Monthly
                        cloud infrastructure bills (AWS, Google, Vercel) are paid directly by you to the provider. We
                        optimize these to be as low as possible.
                    </p>
                </div>

                <div className="pricing-cta">
                    <a href="#contact" className="loga-btn">
                        Get a Free Architecture Review →
                    </a>
                </div>
            </div>
        </section>
    );
}
