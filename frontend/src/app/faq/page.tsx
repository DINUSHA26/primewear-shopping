
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking number. You can also track your order in the 'My Orders' section of your account."
    },
    {
        question: "Can I return an item?",
        answer: "Yes, we accept returns within 30 days of purchase. Items must be unworn and in their original packaging. Please visit our Returns & Exchanges page for more details."
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within Sri Lanka. However, we are working on expanding our reach globally soon!"
    },
    {
        question: "How do I become a vendor?",
        answer: "We are always looking for talented local artisans! Visit our 'Sell on Village Vogue' page to learn more about our vendor application process."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and cash on delivery for your convenience."
    },
    {
        question: "Are your products handmade?",
        answer: "Yes! The majority of our products are handcrafted by local artisans in Sri Lankan villages, ensuring unique designs and high quality."
    }
];

export default function FAQPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Frequently Asked Questions"
                subtitle="Find quick answers to common questions about Village Vogue."
            />

            <div className="max-w-3xl mx-auto space-y-8">
                {faqItems.map((item, index) => (
                    <div key={index} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
                        <details className="group">
                            <summary className="flex justify-between items-center w-full p-6 text-left cursor-pointer list-none font-bold text-lg text-zinc-900 focus:outline-none">
                                <span>{item.question}</span>
                                <span className="transition group-open:rotate-180">
                                    <ChevronDown size={20} className="text-zinc-400 group-hover:text-indigo-600" />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                {item.answer}
                            </div>
                        </details>
                    </div>
                ))}

                <div className="text-center pt-16">
                    <p className="text-zinc-500 mb-4">Still have questions?</p>
                    <a href="/contact" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
