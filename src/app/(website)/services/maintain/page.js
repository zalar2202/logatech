import MaintainHero from "@/components/website/maintain/MaintainHero";
import MaintainTargetClients from "@/components/website/maintain/MaintainTargetClients";
import MaintainServices from "@/components/website/maintain/MaintainServices";
import MaintainProcess from "@/components/website/maintain/MaintainProcess";
import MaintainDeliverables from "@/components/website/maintain/MaintainDeliverables";
import MaintainPricing from "@/components/website/maintain/MaintainPricing";
import MaintainWhyLoga from "@/components/website/maintain/MaintainWhyLoga";
import MaintainBundleBanner from "@/components/website/maintain/MaintainBundleBanner";
import MaintainFAQ from "@/components/website/maintain/MaintainFAQ";
import GlobalCTA from "@/components/website/shared/GlobalCTA";

export const metadata = {
    title: "Maintenance & Support Services | LogaTech",
    description:
        "Proactive website maintenance, security patching, and 24/7 uptime monitoring. Keep your digital business running smoothly with LogaTech support plans.",
};

export default function MaintainServicePage() {
    return (
        <div className="page maintain-page main-content">
            <MaintainHero />
            <MaintainTargetClients />
            <MaintainServices />
            <MaintainProcess />
            <MaintainDeliverables />
            <MaintainPricing />
            <MaintainWhyLoga />
            <MaintainBundleBanner />
            <MaintainFAQ />
            <GlobalCTA
                title="Sleep Soundly. We've Got Your Back."
                description="Join the businesses that trust LogaTech to protect and grow their online presence. Choose a plan or schedule a free site audit today."
                primaryButtonLabel="Choose a Maintenance Plan"
                secondaryButtonLabel="Get a Free Site Audit"
            />
        </div>
    );
}
