import "@/styles/website.css";
import WebsiteHeader from "@/components/website/layout/WebsiteHeader";
import WebsiteFooter from "@/components/website/layout/WebsiteFooter";
import dynamic from "next/dynamic";

const AIFloatingButton = dynamic(() => import("@/components/website/shared/AIFloatingButton"), {
    ssr: false,
});

export default function WebsiteLayout({ children }) {
    return (
        <div className="website-layout">
            <WebsiteHeader />
            <main>{children}</main>
            <WebsiteFooter />
            <AIFloatingButton />
        </div>
    );
}
