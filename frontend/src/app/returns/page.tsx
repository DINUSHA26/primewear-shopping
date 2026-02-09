
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Returns & Exchanges"
                subtitle="Flexible options to ensure you love your Village Vogue purchase."
            />

            <div className="max-w-4xl mx-auto space-y-16">
                {/* 30-Day Guarantee */}
                <div className="bg-indigo-600 rounded-[40px] p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full w-[400px] h-[400px] blur-3xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                            <RefreshCcw size={32} />
                        </div>
                        <h2 className="text-3xl font-black mb-4">30-Day Satisfaction Guarantee</h2>
                        <p className="max-w-xl mx-auto text-indigo-100 text-lg">
                            If you're not completely satisfied with your purchase, return it within 30 days for a full refund or exchange. No questions asked.
                        </p>
                    </div>
                </div>

                {/* Process Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-zinc-100">01</div>
                        <h3 className="text-xl font-bold text-zinc-900">Initiate Return</h3>
                        <p className="text-zinc-500">
                            Go to your "My Orders" page and click "Return Item" next to the product you wish to return.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-zinc-100">02</div>
                        <h3 className="text-xl font-bold text-zinc-900">Pack & Ship</h3>
                        <p className="text-zinc-500">
                            Pack the item securely. Use our pre-paid shipping label or ship via your preferred carrier.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-6xl font-black text-zinc-100">03</div>
                        <h3 className="text-xl font-bold text-zinc-900">Get Refunded</h3>
                        <p className="text-zinc-500">
                            Once we receive and inspect the item, your refund will be processed to your original payment method.
                        </p>
                    </div>
                </div>

                <div className="border-t border-zinc-100 pt-16">
                    <h3 className="text-2xl font-black text-zinc-900 mb-8">Items Eligible for Return</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-emerald-50 p-6 rounded-2xl flex items-start gap-4">
                            <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-emerald-900 mb-1">Returnable Items</h4>
                                <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
                                    <li>Unworn clothing with original tags</li>
                                    <li>Products with manufacturing defects</li>
                                    <li>Incorrect items sent by vendor</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-rose-50 p-6 rounded-2xl flex items-start gap-4">
                            <XCircle className="text-rose-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-rose-900 mb-1">Non-Returnable Items</h4>
                                <ul className="text-sm text-rose-800 space-y-1 list-disc list-inside">
                                    <li>Custom-made or personalized items</li>
                                    <li>Intimate apparel and swimwear</li>
                                    <li>Items marked as "Final Sale"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
