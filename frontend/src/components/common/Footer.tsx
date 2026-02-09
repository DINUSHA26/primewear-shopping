import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-50 border-t border-zinc-200">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600">
                            VILLAGE<span className="text-zinc-900">VOGUE</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Empowering small-scale local garments to reach customers worldwide. Discover unique, handcrafted clothing from the heart of our villages.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white rounded-full text-zinc-400 hover:text-indigo-600 shadow-sm border border-zinc-100 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-zinc-400 hover:text-indigo-600 shadow-sm border border-zinc-100 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-zinc-400 hover:text-indigo-600 shadow-sm border border-zinc-100 transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-zinc-900 font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">All Products</Link></li>
                            <li><Link href="/products?featured=true" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Featured</Link></li>
                            <li><Link href="/about" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Our Story</Link></li>
                            <li><Link href="/contact" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-zinc-900 font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shipping" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Returns & Exchanges</Link></li>
                            <li><Link href="/faq" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">FAQs</Link></li>
                            <li><Link href="/privacy" className="text-zinc-500 hover:text-indigo-600 transition-colors text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-zinc-900 font-bold mb-6">Newsletter</h4>
                        <p className="text-zinc-500 text-sm mb-4">Subscribe to get updates on new arrivals and village stories.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white border border-zinc-200 rounded-l-xl px-4 py-3 text-sm flex-1 focus:outline-none focus:border-indigo-500"
                            />
                            <button className="bg-indigo-600 text-white px-4 py-3 rounded-r-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-zinc-400 text-xs gap-4">
                    <p>© 2026 Village Vogue Marketplace. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <span>Powered by Village Garments</span>
                        <span>Handmade with Love</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
