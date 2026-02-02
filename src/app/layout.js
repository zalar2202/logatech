import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "@/styles/panel.css";
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
    title: {
        default: "Loga Tech",
        template: "%s | Loga Tech",
    },
    description: "Loga Tech - From Code to Cloud",
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
