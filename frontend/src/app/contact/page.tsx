
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/primary/Button';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Get in Touch"
                subtitle="We're here to help. Reach out to us or our vendors directly."
            />

            <div className="max-w-6xl mx-auto space-y-16">
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl font-black text-zinc-900 mb-6">Let's talk.</h3>
                            <p className="text-zinc-500 max-w-md">
                                Have a question about an order? Need help choosing a size? Or just want to share your feedback? Our dedicated support team is ready to assist you.
                            </p>
                        </div>

                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">Email Us</h4>
                                    <p className="text-zinc-500 text-sm">support@villagevogue.com</p>
                                    <p className="text-zinc-400 text-xs mt-1">We typically reply within 24 hours.</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">Live Chat</h4>
                                    <p className="text-zinc-500 text-sm">Available on our website</p>
                                    <p className="text-zinc-400 text-xs mt-1">9:00 AM - 6:00 PM (Mon-Fri)</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">Call Support</h4>
                                    <p className="text-zinc-500 text-sm">+94 77 123 4567</p>
                                    <p className="text-zinc-400 text-xs mt-1">Standard carrier rates apply.</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">Head Office</h4>
                                    <p className="text-zinc-500 text-sm">123 Main Street, Colombo 03, Sri Lanka</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-zinc-100">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Name</label>
                                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-700" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Email</label>
                                    <input type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-700" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Subject</label>
                                <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-700">
                                    <option>General Inquiry</option>
                                    <option>Order Status</option>
                                    <option>Vendor Partnership</option>
                                    <option>Returns & Refunds</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Message</label>
                                <textarea className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[150px] font-medium text-zinc-700" placeholder="Write your message here..."></textarea>
                            </div>
                            <Button size="lg" className="w-full py-4 rounded-xl text-sm uppercase tracking-widest font-bold bg-zinc-900 hover:bg-zinc-800">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
