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
import GlobalCTA from "@/components/website/shared/GlobalCTA";

export const metadata = {
    title: "Development Services | LogaTech",
    description:
        "Build high-performance web applications with robust, scalable, and secure code. We transform ideas into powerful digital products.",
    alternates: {
        canonical: "/services/develop",
    },
    openGraph: {
        title: "Expert Web Development Services | LogaTech",
        description: "Transform your ideas into powerful digital products with our scalable and secure development services.",
        url: "/services/develop",
        type: "website",
    },
};

export default function DevelopServicePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Expert Web Development",
        "provider": {
            "@type": "Organization",
            "name": "LogaTech",
            "url": "https://logatech.net",
        },
        "description":
            "Build high-performance web applications with robust, scalable, and secure code. We transform ideas into powerful digital products.",
        "serviceType": "Web Development",
        "areaServed": "Global",
    };

    return (
        <div className="page develop-page main-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
            <GlobalCTA
                title="Ready to Build Your Solution?"
                description="Whether it's a new MVP or a complex platform, let's discuss the technical roadmap to make it real."
                primaryButtonLabel="Book Technical Consult"
                secondaryButtonLabel="Email Requirements"
            />
        </div>
    );
}
