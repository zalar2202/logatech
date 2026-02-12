import DesignHero from "@/components/website/design/DesignHero";
import IdealFor from "@/components/website/design/IdealFor";
import ServiceBreakdown from "@/components/website/design/ServiceBreakdown";
import DesignProcess from "@/components/website/design/DesignProcess";
import Deliverables from "@/components/website/design/Deliverables";
import PricingGuidance from "@/components/website/design/PricingGuidance";
import UseCases from "@/components/website/design/UseCases";
import WhyDifferent from "@/components/website/design/WhyDifferent";
import BundleBanner from "@/components/website/design/BundleBanner";
import DesignFAQ from "@/components/website/design/DesignFAQ";
import GlobalCTA from "@/components/website/shared/GlobalCTA";

export const metadata = {
    title: "Design Services | LogaTech",
    description:
        "Strategic web design that elevates your brand, communicates your message, and converts visitors into customers. Beautiful, strategic, built for growth.",
    alternates: {
        canonical: "/services/design",
    },
    openGraph: {
        title: "Strategic Web Design Services | LogaTech",
        description: "Elevate your brand with beautiful, strategic web design built for growth and conversion.",
        url: "/services/design",
        type: "website",
    },
};

export default function DesignServicePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Strategic Web Design",
        "provider": {
            "@type": "Organization",
            "name": "LogaTech",
            "url": "https://logatech.net",
        },
        "description":
            "Strategic web design that elevates your brand, communicates your message, and converts visitors into customers. Beautiful, strategic, built for growth.",
        "serviceType": "Web Design",
        "areaServed": "Global",
    };

    return (
        <div className="page design-page main-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DesignHero />
            <IdealFor />
            <ServiceBreakdown />
            <DesignProcess />
            <Deliverables />
            <PricingGuidance />
            <UseCases />
            <WhyDifferent />
            <BundleBanner />
            <DesignFAQ />
            <GlobalCTA
                title="Ready to Design Your Site?"
                description="Let's talk about your goals and map out your digital presence. No commitment — just a conversation about what's possible."
                primaryButtonLabel="Book a Discovery Call"
                secondaryButtonLabel="Send Project Details"
            />
        </div>
    );
}
