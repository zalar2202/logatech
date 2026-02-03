"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SmartCTA from "@/components/website/shared/SmartCTA";

export default function MaintainCTA() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="contact" className="section cta-section">
            <div ref={ref} className={`cta-content ${isVisible ? "visible" : ""}`}>
                <h2 className="cta-title">Sleep Soundly. We've Got Your Back.</h2>
                <p className="cta-description">
                    Join the businesses that trust Loga Tech to protect and grow their online presence.
                    Choose a plan or schedule a free site audit today.
                </p>
                <div className="cta-buttons">
                    <SmartCTA 
                        label="Choose a Maintenance Plan" 
                        className="loga-btn large" 
                    />
                </div>
                <div className="cta-secondary">
                    <SmartCTA 
                        label="Get a Free Site Audit" 
                        className="loga-alt-btn" 
                    />
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
