import "@/styles/website.css";
import WebsiteHeader from "@/components/website/layout/WebsiteHeader";
import WebsiteFooter from "@/components/website/layout/WebsiteFooter";
import AIFloatingButton from "@/components/website/shared/AIFloatingButton";

export default function WebsiteLayout({ children }) {
    return (
        <>
            <WebsiteHeader />
            <main>{children}</main>
            <WebsiteFooter />
            <AIFloatingButton />
        </>
    );
}
