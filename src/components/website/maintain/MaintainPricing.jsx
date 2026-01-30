"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pricingTiers = [
    {
        type: "Essential",
        price: "$100",
        features: ["Security Monitoring", "Daily Off-site Backups", "Monthly Health Report", "Plugin Updates"],
    },
    {
        type: "Professional",
        price: "$250",
        features: ["Everything in Essential", "1 Hour Dev Support", "Priority Response Time", "Performance Tuning"],
    },
    {
        type: "Enterprise",
        price: "Custom",
        features: ["Everything in Professional", "Custom SLAs", "24/7 Emergency Support", "Dedicated Account Manager"],
    },
];

export default function MaintainPricing() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="section pricing-section">
            <h2 className="section-title">Support Plans</h2>
            <div ref={ref} className={`pricing-content ${isVisible ? "visible" : ""}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {pricingTiers.map((tier, index) => (
                        <div
                            key={index}
                            className="loga-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)' }}>{tier.type}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '16px 0', color: 'var(--color-text-primary)' }}>
                                {tier.price}<span style={{ fontSize: '1.2rem', fontWeight: '400', color: 'var(--color-text-secondary)' }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', flexGrow: 1 }}>
                                {tier.features.map((feature, i) => (
                                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.95rem' }}>
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <a href="#contact" className="loga-btn" style={{ marginTop: '24px', textAlign: 'center' }}>
                                Subscribe Now
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
