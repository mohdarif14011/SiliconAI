
'use client';

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Get started with the basics and see how you can improve.",
    features: [
      "1 Mock Interview per month",
      "Basic Performance Report",
      "Resume Analyzer (1 scan)",
    ],
    cta: "Start for Free",
    variant: "outline",
  },
  {
    name: "Pro",
    price: "$15",
    period: "/ month",
    description: "Unlock your full potential with unlimited practice and in-depth analytics.",
    features: [
      "Unlimited Mock Interviews",
      "Detailed Performance Reports",
      "Unlimited Resume Scans",
      "Advanced Skill Tracking",
      "Priority Support",
    ],
    cta: "Go Pro",
    variant: "default",
  },
];


export default function PricingPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <PageHeader title="Pricing" />
            <main className="flex-1 space-y-8 p-4 md:p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Find the perfect plan for you</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Whether you're just starting out or preparing for multiple interviews, we have a plan that fits your needs.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    {pricingTiers.map((tier) => (
                        <Card key={tier.name} className={tier.variant === 'default' ? 'border-primary' : ''}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    <span className="text-muted-foreground">{tier.period}</span>
                                </div>
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={tier.variant as any}>
                                    {tier.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
