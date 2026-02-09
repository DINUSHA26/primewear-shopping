
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Users, Truck, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Our Story"
                subtitle="Connecting rural craftsmanship with the modern world."
            />

            <div className="max-w-4xl mx-auto space-y-16">
                <section className="text-zinc-600 text-lg space-y-6 leading-relaxed">
                    <p className="text-xl md:text-2xl font-light text-zinc-800 mb-8 leading-normal">
                        Village Vogue isn't just a marketplace; it's a movement. We were founded on a simple belief: that talent is universal, but opportunity is not.
                    </p>
                    <p>
                        In the hidden corners of our country, thousands of skilled garment workers—mostly women—create beautiful, high-quality clothing. For decades, their reach was limited to their local villages. They had the skill, the passion, and the dedication, but they lacked the platform to showcase their work to a broader audience.
                    </p>
                    <p>
                        That's where we come in. We built this platform to bridge the gap between these talented local artisans and fashion-conscious consumers like you who value authenticity, quality, and ethical production.
                    </p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Empowering Communities</h3>
                        <p className="text-zinc-500">
                            Every purchase directly supports a local family. We take a minimal commission to keep the platform running, ensuring the bulk of the profit goes straight to the hands that made the clothes.
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                            <Heart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Handmade with Love</h3>
                        <p className="text-zinc-500">
                            Unlike mass-produced fast fashion, our items are often made in small batches or are one-of-a-kind. Each stitch tells a story of tradition and care.
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Sustainable Fashion</h3>
                        <p className="text-zinc-500">
                            By supporting local production, we reduce carbon footprints associated with global shipping chains. Our vendors often use locally sourced, sustainable materials.
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                            <Truck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3">Direct to Doorstep</h3>
                        <p className="text-zinc-500">
                            We handle the logistics so our vendors can focus on what they do best—creating. We ensure reliable, tracked delivery from their workshop to your home.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
