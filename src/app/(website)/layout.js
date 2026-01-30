import "@/styles/website.css";
import WebsiteHeader from "@/components/website/layout/WebsiteHeader";
import WebsiteFooter from "@/components/website/layout/WebsiteFooter";

export default function WebsiteLayout({ children }) {
    return (
        <>
            <WebsiteHeader />
            <main>{children}</main>
            <WebsiteFooter />
        </>
    );
}
