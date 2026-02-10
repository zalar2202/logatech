import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "@/styles/tailwind.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreProvider } from "@/lib/StoreProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Website fonts (used by website pages)
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

// Script to prevent flash of wrong theme (runs before React hydration)
const themeScript = `
(function() {
    try {
        var theme = localStorage.getItem('theme');
        var resolved = theme;
        if (!theme || theme === 'system') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolved);
    } catch (e) {}
})();
`;

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://logatech.net"),
    title: {
        default: "LogaTech",
        template: "%s | LogaTech",
    },
    description: "LogaTech - From Code to Cloud",
    icons: {
        icon: [
            { url: "/assets/favicon/favicon.ico" },
            { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/assets/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [{ url: "/assets/favicon/apple-touch-icon.png" }],
        other: [
            {
                rel: "android-chrome-512x512",
                url: "/assets/favicon/android-chrome-512x512.png",
            },
        ],
    },
    manifest: "/assets/favicon/site.webmanifest",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://logatech.net",
        siteName: "LogaTech",
        title: "LogaTech - From Code to Cloud",
        description: "Innovative Digital Solutions & Strategic Web Development",
        images: [
            {
                url: "/assets/favicon/android-chrome-512x512.png",
                width: 512,
                height: 512,
                alt: "LogaTech Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "LogaTech - From Code to Cloud",
        description: "Innovative Digital Solutions & Strategic Web Development.",
        images: ["/assets/favicon/android-chrome-512x512.png"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfairDisplay.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <AuthProvider>
                        <StoreProvider>
                            <CartProvider>
                                <NotificationProvider>{children}</NotificationProvider>
                            </CartProvider>
                            <Toaster position="top-right" richColors />
                        </StoreProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
