import {
    LayoutDashboard,
    Users,
    Blocks,
    UserPlus,
    Database,
    Network,
    Bell,
    Send,
    Settings,
    Tag,
    Mail,
    Building2,
    FileText,
    CreditCard,
    Ticket,
    Activity,
    ShoppingCart,
    Store,
} from "lucide-react";

export const navigation = [
    {
        name: "Dashboard",
        href: "/panel/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Shop",
        href: "/panel/shop",
        icon: Store,
    },
    {
        name: "My Cart",
        href: "/panel/cart",
        icon: ShoppingCart,
    },
    {
        name: "My Services",
        href: "/panel/services",
        icon: Activity,
        roles: ["user"],
    },
    {
        name: "Support Tickets",
        href: "/panel/tickets",
        icon: Ticket,
    },
    {
        name: "Notifications",
        href: "/panel/notifications",
        icon: Bell,
    },
    {
        name: "Settings",
        href: "/panel/settings",
        icon: Settings,
    },
];

// Admin-only navigation items
export const adminNavigation = [
    {
        name: "User Management",
        href: "/panel/users",
        icon: Users,
        roles: ["admin", "manager"],
    },
    {
        name: "Clients",
        href: "/panel/clients",
        icon: Building2,
        roles: ["admin", "manager"],
    },
    {
        name: "Invoices",
        href: "/panel/invoices",
        icon: FileText,
        roles: ["admin", "manager"],
    },
    {
        name: "Payments",
        href: "/panel/payments",
        icon: CreditCard,
        roles: ["admin", "manager"],
    },
    {
        name: "Packages",
        href: "/panel/packages",
        icon: Blocks,
        roles: ["admin", "manager"],
    },
    {
        name: "Promotions",
        href: "/panel/promotions",
        icon: Tag,
        roles: ["admin", "manager"],
    },
    {
        name: "Send Notification",
        href: "/panel/notifications/send",
        icon: Send,
        roles: ["admin", "manager"],
    },
    {
        name: "Email Marketing",
        href: "/panel/marketing/email",
        icon: Mail,
        roles: ["admin", "manager"],
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
