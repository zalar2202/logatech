import MaintainHero from "@/components/website/maintain/MaintainHero";
import MaintainTargetClients from "@/components/website/maintain/MaintainTargetClients";
import MaintainServices from "@/components/website/maintain/MaintainServices";
import MaintainProcess from "@/components/website/maintain/MaintainProcess";
import MaintainDeliverables from "@/components/website/maintain/MaintainDeliverables";
import MaintainPricing from "@/components/website/maintain/MaintainPricing";
import MaintainWhyLoga from "@/components/website/maintain/MaintainWhyLoga";
import MaintainBundleBanner from "@/components/website/maintain/MaintainBundleBanner";
import MaintainFAQ from "@/components/website/maintain/MaintainFAQ";
import MaintainCTA from "@/components/website/maintain/MaintainCTA";

export const metadata = {
    title: "Maintenance & Support Services | Loga Tech",
    description:
        "Proactive website maintenance, security patching, and 24/7 uptime monitoring. Keep your digital business running smoothly with Loga Tech support plans.",
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
            <MaintainCTA />
        </div>
    );
}
