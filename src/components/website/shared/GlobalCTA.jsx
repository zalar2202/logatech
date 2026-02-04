"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SmartCTA from "@/components/website/shared/SmartCTA";

/**
 * GlobalCTA - Consolidated call-to-action section
 * Supports custom content for different pages while keeping contact info dry.
 */
export default function GlobalCTA({
    title = "Ready to Build Something Great?",
    description = "Let's turn your vision into reality. Whether you're starting fresh or looking to level up your digital presence, we're here to help.",
    primaryButtonLabel = "Start a Conversation",
    secondaryButtonLabel = null,
    secondaryButtonLink = null,
}) {
    const { ref, isVisible } = useScrollAnimation();

    const contactInfo = {
        email: "info@logatech.net",
        phone: "+90 551 061 9856",
        phoneRaw: "+905510619856",
    };

    return (
        <section id="contact" className="section cta-section">
            <div ref={ref} className={`cta-content ${isVisible ? "visible" : ""}`}>
                <h2 className="cta-title">{title}</h2>
                <p className="cta-description">{description}</p>

                <div className="cta-buttons">
                    <SmartCTA label={primaryButtonLabel} className="loga-btn large" />
                </div>

                {secondaryButtonLabel && (
                    <div className="cta-secondary">
                        <SmartCTA label={secondaryButtonLabel} className="loga-alt-btn" />
                    </div>
                )}

                <div className="cta-contact-info">
                    <div className="contact-item">
                        <span className="contact-label">Email</span>
                        <a href={`mailto:${contactInfo.email}`} className="contact-value">
                            {contactInfo.email}
                        </a>
                    </div>
                    <div className="contact-item">
                        <span className="contact-label">Phone</span>
                        <a href={`tel:${contactInfo.phoneRaw}`} className="contact-value">
                            {contactInfo.phone}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
