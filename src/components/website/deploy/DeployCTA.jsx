"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function DeployCTA() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="contact" className="section cta-section">
            <div ref={ref} className={`cta-content ${isVisible ? "visible" : ""}`}>
                <h2 className="cta-title">Ready for Liftoff?</h2>
                <p className="cta-description">
                    Don't let infrastructure headaches hold you back. Let's build a scalable foundation
                    that grows with your business.
                </p>
                <div className="cta-buttons">
                    <a
                        href="mailto:info@logatech.net?subject=Deployment%20Inquiry"
                        className="loga-btn large"
                    >
                        Book Infrastructure Audit
                    </a>
                </div>
                <div className="cta-secondary">
                    <a href="mailto:info@logatech.net" className="loga-alt-btn">
                        Email Requirements
                    </a>
                </div>
                <div className="cta-contact-info">
                    <div className="contact-item">
                        <span className="contact-label">Email</span>
                        <a href="mailto:info@logatech.net" className="contact-value">
                            info@logatech.net
                        </a>
                    </div>
                    <div className="contact-item">
                        <span className="contact-label">Phone</span>
                        <a href="tel:+905510619856" className="contact-value">
                            +90 551 061 9856
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
