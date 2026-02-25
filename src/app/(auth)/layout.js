import "@/styles/panel.css";

/**
 * Auth Layout
 * Special layout for authentication pages (login, register, etc.)
 * No sidebar, no header - just centered content
 */
export default function AuthLayout({ children }) {
    return (
        <div
            className="flex items-center justify-center p-4 overflow-hidden"
            style={{
                height: "100vh",
                width: "100vw",
                backgroundColor: "var(--color-background)",
            }}
        >
            {children}
        </div>
    );
}
