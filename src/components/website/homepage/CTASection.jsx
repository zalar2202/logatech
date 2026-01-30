"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * CTASection - Closing call-to-action section
 */
export default function CTASection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="contact" className="section cta-section">
            <div ref={ref} className={`cta-content ${isVisible ? "visible" : ""}`}>
                <h2 className="cta-title">Ready to Build Something Great?</h2>
                <p className="cta-description">
                    Let's turn your vision into reality. Whether you're starting fresh or looking to
                    level up your digital presence, we're here to help.
                </p>
                <div className="cta-buttons">
                    <a href="mailto:info@logatech.net" className="loga-btn large">
                        Start a Conversation
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
