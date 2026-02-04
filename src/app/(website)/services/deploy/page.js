import DeployHero from "@/components/website/deploy/DeployHero";
import DeployTargetClients from "@/components/website/deploy/DeployTargetClients";
import DeployServices from "@/components/website/deploy/DeployServices";
import DeployProcess from "@/components/website/deploy/DeployProcess";
import DeployDeliverables from "@/components/website/deploy/DeployDeliverables";
import DeployPricing from "@/components/website/deploy/DeployPricing";
import DeployTechStack from "@/components/website/deploy/DeployTechStack";
import DeployWhyLoga from "@/components/website/deploy/DeployWhyLoga";
import DeployBundleBanner from "@/components/website/deploy/DeployBundleBanner";
import DeployFAQ from "@/components/website/deploy/DeployFAQ";
import GlobalCTA from "@/components/website/shared/GlobalCTA";

export const metadata = {
    title: "Deployment Services | LogaTech",
    description:
        "Launch your web application with confidence. Enterprise-grade cloud infrastructure, CI/CD automation, and zero-downtime deployments.",
};

export default function DeployServicePage() {
    return (
        <div className="page deploy-page main-content">
            <DeployHero />
            <DeployTargetClients />
            <DeployServices />
            <DeployProcess />
            <DeployDeliverables />
            <DeployTechStack />
            <DeployPricing />
            <DeployWhyLoga />
            <DeployBundleBanner />
            <DeployFAQ />
            <GlobalCTA
                title="Ready for Liftoff?"
                description="Don't let infrastructure headaches hold you back. Let's build a scalable foundation that grows with your business."
                primaryButtonLabel="Book Infrastructure Audit"
                secondaryButtonLabel="Email Requirements"
            />
        </div>
    );
}
