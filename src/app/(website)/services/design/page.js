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
};

export default function DesignServicePage() {
    return (
        <div className="page design-page main-content">
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
