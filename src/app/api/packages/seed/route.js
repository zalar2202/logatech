import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { verifyToken } from '@/lib/jwt';
import { getAuthToken } from '@/lib/cookies';

export async function POST(request) {
    try {
        const token = await getAuthToken();
        const decoded = verifyToken(token);
        if (!['admin', 'manager'].includes(decoded.role)) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        await connectDB();

        const seedPackages = [
            // Design Packages
            {
                name: "Personal / Portfolio",
                category: "design",
                startingPrice: "$800",
                price: 800,
                priceRange: "$800 – $1,500",
                features: ["Custom UI Design", "Responsive Layout", "Basic SEO", "Contact Form"],
                deliveryTime: "1-2 weeks",
                revisions: "2 Rounds",
                order: 1
            },
            {
                name: "Business Brochure",
                category: "design",
                startingPrice: "$1,200",
                price: 1200,
                priceRange: "$1,200 – $2,500",
                features: ["Professional UI/UX", "Brand Integration", "Social Media Setup", "Content Migration"],
                deliveryTime: "2-3 weeks",
                revisions: "3 Rounds",
                order: 2
            },
            {
                name: "E-commerce / WooCommerce",
                category: "design",
                startingPrice: "$2,000",
                price: 2000,
                priceRange: "$2,000 – $4,000",
                features: ["Product Focus UX", "Payment Integration", "Inventory Management", "User Accounts"],
                deliveryTime: "3-5 weeks",
                revisions: "3 Rounds",
                order: 3
            },
            {
                name: "Custom Web Application",
                category: "design",
                startingPrice: "$3,000",
                price: 3000,
                priceRange: "$3,000 – $8,000+",
                features: ["Complex Dashboards", "Interactive Data", "Scalable Systems", "Dedicated Support"],
                deliveryTime: "Custom",
                revisions: "Iterative",
                order: 4
            },
            // Development Packages
            {
                name: "Marketing / Landing Page",
                category: "development",
                startingPrice: "$1,000",
                price: 1000,
                priceRange: "$1,000 – $2,500",
                features: ["React/Next.js Build", "High Performance", "SEO Optimized", "Analytics Setup"],
                deliveryTime: "1 week",
                revisions: "2 Rounds",
                order: 1
            },
            {
                name: "Custom Content Site (CMS)",
                category: "development",
                startingPrice: "$2,500",
                price: 2500,
                priceRange: "$2,500 – $5,000",
                features: ["Headless CMS", "Dynamic Content", "Multi-language Support", "Fast Load Times"],
                deliveryTime: "3 weeks",
                revisions: "3 Rounds",
                order: 2
            },
            {
                name: "Web Application (MVP)",
                category: "development",
                startingPrice: "$5,000",
                price: 5000,
                priceRange: "$5,000 – $10,000",
                features: ["Custom Architecture", "User Authentication", "API Integrations", "Database Design"],
                deliveryTime: "1-2 months",
                revisions: "Iterative",
                order: 3
            },
            // Maintenance Packages
            {
                name: "Essential Support",
                category: "maintenance",
                startingPrice: "$100",
                price: 100,
                priceRange: "per month",
                features: ["Security Monitoring", "Daily Backups", "Health Report", "Plugin Updates"],
                deliveryTime: "Monthly",
                revisions: "N/A",
                order: 1
            },
            {
                name: "Professional Support",
                category: "maintenance",
                startingPrice: "$250",
                price: 250,
                priceRange: "per month",
                features: ["1h Dev Support", "Priority Response", "Performance Tuning", "Deep Backups"],
                deliveryTime: "Monthly",
                revisions: "N/A",
                order: 2
            }
        ];

        // Seed Packages
        await Package.deleteMany({ category: { $in: ['design', 'development', 'maintenance'] } });
        await Package.insertMany(seedPackages);

        // Seed sample promotions
        const Promotion = (await import('@/models/Promotion')).default;
        await Promotion.deleteMany({});
        await Promotion.insertMany([
            {
                title: "New Year Launch Special",
                description: "Get 20% off on all Custom Web Applications started in January 2026.",
                discountCode: "NEWYEAR2026",
                discountAmount: "20% OFF",
                isActive: true,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-02-01')
            },
            {
                title: "Maintenance Bundle",
                description: "Subscribe to Professional Maintenance for 12 months and get 2 months free.",
                isActive: true,
                startDate: new Date('2026-01-20')
            }
        ]);

        return NextResponse.json({ success: true, message: 'Packages and Promotions seeded successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
