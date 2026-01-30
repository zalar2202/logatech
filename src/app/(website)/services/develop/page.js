import DevelopHero from "@/components/website/develop/DevelopHero";
import TargetClients from "@/components/website/develop/TargetClients";
import TechCapabilities from "@/components/website/develop/TechCapabilities";
import DevProcess from "@/components/website/develop/DevProcess";
import DevDeliverables from "@/components/website/develop/DevDeliverables";
import DevPricing from "@/components/website/develop/DevPricing";
import DevUseCases from "@/components/website/develop/DevUseCases";
import CodeQuality from "@/components/website/develop/CodeQuality";
import TechStack from "@/components/website/develop/TechStack";
import DevBundleBanner from "@/components/website/develop/DevBundleBanner";
import DevFAQ from "@/components/website/develop/DevFAQ";
import DevCTA from "@/components/website/develop/DevCTA";

export const metadata = {
    title: "Development Services | Loga Tech",
    description:
        "Build high-performance web applications with robust, scalable, and secure code. We transform ideas into powerful digital products.",
};

export default function DevelopServicePage() {
    return (
        <div className="page develop-page main-content">
            <DevelopHero />
            <TargetClients />
            <TechCapabilities />
            <DevProcess />
            <DevDeliverables />
            <DevPricing />
            <DevUseCases />
            <CodeQuality />
            <TechStack />
            <DevBundleBanner />
            <DevFAQ />
            <DevCTA />
        </div>
    );
}
