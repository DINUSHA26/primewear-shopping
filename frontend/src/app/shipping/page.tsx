
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Package, Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Shipping Policy"
                subtitle="Fast, reliable delivery straight from our local artisans to you."
            />

            <div className="max-w-4xl mx-auto space-y-16">
                {/* Shipping Methods Section */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-zinc-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Truck size={200} />
                    </div>

                    <h3 className="text-2xl font-black text-zinc-900 mb-8 relative z-10">Delivery Options</h3>

                    <div className="grid md:grid-cols-2 gap-6 relative z-10">
                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Truck size={24} />
                                </div>
                                <span className="text-lg font-black text-zinc-900">LKR 350</span>
                            </div>
                            <h4 className="font-bold text-zinc-900 mb-1">Standard Delivery</h4>
                            <p className="text-sm text-zinc-500">Islands-wide delivery within 3-5 business days.</p>
                        </div>

                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 hover:border-amber-100 hover:bg-amber-50/30 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <Clock size={24} />
                                </div>
                                <span className="text-lg font-black text-zinc-900">LKR 650</span>
                            </div>
                            <h4 className="font-bold text-zinc-900 mb-1">Express Priority</h4>
                            <p className="text-sm text-zinc-500">Guaranteed next-day delivery for Colombo & Suburbs.</p>
                        </div>
                    </div>
                </div>

                {/* Policy Details */}
                <div className="max-w-3xl mx-auto space-y-12 text-zinc-600 leading-relaxed">
                    <section>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-4">Reviewing Your Order</h3>
                        <p>
                            Once your order is placed, our vendors immediately begin preparing your items. Handmade goods may take an additional 1-2 days for crafting and quality checks. You will receive a notification as soon as your package is handed over to our logistics partner.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-4">Remote Areas</h3>
                        <p>
                            We are proud to serve even the most remote areas of Sri Lanka. However, please allow an additional 2-3 days for deliveries to deep rural locations. Our commitment is to ensure your package arrives safely, no matter the distance.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-4">International Shipping</h3>
                        <p>
                            Currently, we primarily serve the domestic market. However, we are piloting international shipping for bulk orders. Please contact our support team for more details on overseas shipments.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
