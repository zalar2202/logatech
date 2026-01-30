import Hero from "@/components/website/homepage/Hero";
import AboutSection from "@/components/website/homepage/AboutSection";
import Services from "@/components/website/homepage/Services";
import WhyLoga from "@/components/website/homepage/WhyLoga";
import ProcessTimeline from "@/components/website/homepage/ProcessTimeline";
import TechStack from "@/components/website/shared/TechStack";
import FAQAccordion from "@/components/website/homepage/FAQAccordion";
import CTASection from "@/components/website/homepage/CTASection";

export const dynamic = "force-dynamic";

const processSteps = [
    {
        subtitle: "Let's connect",
        title: "Discovery Call",
        description:
            "We start with a conversation to understand your goals, challenges, and vision. No commitments — just an honest discussion about what's possible.",
    },
    {
        subtitle: "Map it out",
        title: "Strategy & Planning",
        description:
            "We create a detailed roadmap with timelines, milestones, and deliverables. You'll know exactly what to expect and when.",
    },
    {
        subtitle: "Bring it to life",
        title: "Design & Prototype",
        description:
            "Your vision takes shape through wireframes and visual designs. We iterate together until it feels just right.",
    },
    {
        subtitle: "Build it right",
        title: "Development",
        description:
            "Clean, tested code built with modern best practices. We keep you updated throughout with regular progress demos.",
    },
    {
        subtitle: "Go live",
        title: "Launch",
        description:
            "Careful deployment with proper hosting, security, and optimization. We ensure everything runs smoothly from day one.",
    },
    {
        subtitle: "Grow together",
        title: "Support & Evolution",
        description:
            "Our partnership doesn't end at launch. We provide ongoing support, updates, and improvements as your needs evolve.",
    },
];

const faqItems = [
    {
        question: "How long does a typical project take?",
        answer: "Project timelines vary based on scope and complexity. A simple marketing website might take 2-4 weeks, while a complex web application could take 2-6 months. We'll provide a detailed timeline during our planning phase.",
    },
    {
        question: "What's your pricing model?",
        answer: "We offer both project-based pricing and retainer arrangements. After understanding your needs, we provide a transparent quote with no hidden fees. We work with various budgets and can often phase projects to fit your financial planning.",
    },
    {
        question: "Do you work with clients outside your timezone?",
        answer: "Absolutely! We have experience working with clients globally. We adapt our communication schedule to ensure overlap for meetings and maintain asynchronous updates for everything else.",
    },
    {
        question: "What technologies do you use?",
        answer: "We choose technologies based on your project needs. Our core stack includes React, Next.js, Node.js, and various databases. For content-driven sites, we often work with WordPress. We're always learning and adopting the best tools for each job.",
    },
    {
        question: "What if I need changes after launch?",
        answer: "We offer ongoing maintenance packages for post-launch support. This includes bug fixes, updates, small feature additions, and performance monitoring. We're here for the long term.",
    },
    {
        question: "How do we communicate during the project?",
        answer: "We establish a communication rhythm that works for you — whether that's Slack, email, or regular video calls. You'll have direct access to our team and receive regular progress updates.",
    },
];

export default function HomePage() {
    return (
        <div className="page home-page main-content">
            <Hero />
            <AboutSection />
            <Services />
            <WhyLoga />
            <ProcessTimeline steps={processSteps} />
            <TechStack />
            <FAQAccordion items={faqItems} />
            <CTASection />
        </div>
    );
}
