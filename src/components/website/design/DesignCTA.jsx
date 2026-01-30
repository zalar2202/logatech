"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * DesignCTA - Final call-to-action section
 */
export default function DesignCTA() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="contact" className="section cta-section">
            <div ref={ref} className={`cta-content ${isVisible ? "visible" : ""}`}>
                <h2 className="cta-title">Ready to Design Your Site?</h2>
                <p className="cta-description">
                    Let's talk about your goals and map out your digital presence. No commitment —
                    just a conversation about what's possible.
                </p>
                <div className="cta-buttons">
                    <a
                        href="mailto:info@logatech.net?subject=Design%20Project%20Inquiry"
                        className="loga-btn large"
                    >
                        Book a Discovery Call
                    </a>
                </div>
                <div className="cta-secondary">
                    <a href="mailto:info@logatech.net" className="loga-alt-btn">
                        Send Project Details
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
