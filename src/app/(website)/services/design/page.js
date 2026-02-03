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
import DesignCTA from "@/components/website/design/DesignCTA";

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
            <DesignCTA />
        </div>
    );
}
