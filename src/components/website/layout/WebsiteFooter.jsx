import Image from "next/image";

/**
 * Footer - Simple footer component for website pages
 */
export default function WebsiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand flex items-center justify-center gap-2 mb-2">
                    <Image
                        src="/assets/logo/LogaTech-512.webp"
                        alt="LogaTech Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                    />
                    <span>LogaTech</span>
                </div>
                <div className="footer-tagline">Design · Develop · Deploy · Maintain</div>
                <div className="copyright">
                    © 2019-{currentYear} LogaTech. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
