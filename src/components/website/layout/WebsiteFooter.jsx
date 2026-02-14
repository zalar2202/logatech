import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter, Github, Instagram, Star } from "lucide-react";

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
                    <h2 className="text-xl font-bold m-0">LogaTech</h2>
                </div>
                <div className="footer-links flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-sm font-medium">
                    <Link href="/services/design" className="hover:text-[var(--color-primary)] transition-colors">Design</Link>
                    <Link href="/services/develop" className="hover:text-[var(--color-primary)] transition-colors">Develop</Link>
                    <Link href="/services/deploy" className="hover:text-[var(--color-primary)] transition-colors">Deploy</Link>
                    <Link href="/services/maintain" className="hover:text-[var(--color-primary)] transition-colors">Maintain</Link>
                </div>
                
                <div className="social-links flex justify-center gap-4 mb-4">
                    <a 
                        href="https://www.linkedin.com/company/logatechnet/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-secondary)] hover:text-[#0077b5] transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </a>
                    <a 
                        href="https://x.com/logatechnet" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-secondary)] hover:text-black dark:hover:text-white transition-colors"
                        aria-label="X (Twitter)"
                    >
                        <Twitter size={20} />
                    </a>
                    <a 
                        href="https://github.com/LogaTech-net" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-secondary)] hover:text-black dark:hover:text-white transition-colors"
                        aria-label="GitHub"
                    >
                        <Github size={20} />
                    </a>
                    <a 
                        href="https://instagram.com/logatechnet" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-secondary)] hover:text-[#E1306C] transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </a>
                    <a 
                        href="https://clutch.co/profile/logatech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-secondary)] hover:text-[#D41C0F] transition-colors"
                        aria-label="Clutch.co"
                    >
                        <Star size={20} />
                    </a>
                </div>
                <div className="copyright">
                    © 2019-{currentYear} LogaTech. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
