import {
    LayoutDashboard,
    Users,
    Blocks,
    UserPlus,
    Database,
    Network,
    Bell,
    Send,
} from "lucide-react";

export const navigation = [
    {
        name: "Dashboard",
        href: "/panel/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Notifications",
        href: "/panel/notifications",
        icon: Bell,
    },
    {
        name: "User Management",
        href: "/panel/users",
        icon: Users,
    },
];

// Admin-only navigation items
export const adminNavigation = [
    {
        name: "Send Notification",
        href: "/panel/notifications/send",
        icon: Send,
        roles: ["admin", "manager"], // Only visible to admin and manager
    },
];

// Development/Testing pages (optional, can be hidden in production)
export const devNavigation = [
    {
        name: "Components Demo",
        href: "/panel/components-demo",
        icon: Blocks,
    },
    {
        name: "Register Admin",
        href: "/panel/register-admin",
        icon: UserPlus,
    },
    {
        name: "Test DB Connection",
        href: "/panel/test-connection",
        icon: Database,
    },
    {
        name: "Test Axios",
        href: "/panel/test-axios",
        icon: Network,
    },
    {
        name: "Firebase FCM Test",
        href: "/panel/firebase-test",
        icon: Bell,
    },
    {
        name: "Backend Notification Test",
        href: "/panel/backend-notification-test",
        icon: Send,
    },
    {
        name: "Debug Auth",
        href: "/panel/debug-auth",
        icon: Database,
    },
];
