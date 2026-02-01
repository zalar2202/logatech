"use client";

import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import axios from "axios";

export default function MaintainPricing() {
    const { ref, isVisible } = useScrollAnimation();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get("/api/packages?category=maintenance");
                if (res.data.success) {
                    setPackages(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch maintenance packages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <section id="pricing" className="section pricing-section">
            <h2 className="section-title">Support Plans</h2>
            <div ref={ref} className={`pricing-content ${isVisible ? "visible" : ""}`}>
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {packages.length > 0 ? (
                            packages.map((tier, index) => (
                                <div
                                    key={tier._id}
                                    className="loga-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transitionDelay: `${index * 100}ms`
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)' }}>{tier.name}</h3>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '16px 0', color: 'var(--color-text-primary)' }}>
                                        {tier.startingPrice}<span style={{ fontSize: '1.2rem', fontWeight: '400', color: 'var(--color-text-secondary)' }}>/{tier.priceRange || 'mo'}</span>
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
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-[var(--color-text-secondary)]">
                                No support plans currently listed.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
