
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-6 pb-20">
            <PageHeader
                title="Privacy Policy"
                subtitle="Your trust is our priority. Learn how we handle your data."
            />

            <div className="max-w-4xl mx-auto space-y-16">
                <div className="bg-indigo-50 p-8 md:p-12 rounded-[40px] border border-indigo-100 mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <ShieldCheck className="text-indigo-600" size={32} />
                        <h3 className="text-2xl font-black text-indigo-900">Your Privacy Matters</h3>
                    </div>
                    <p className="text-lg text-indigo-800 leading-relaxed max-w-2xl">
                        At Village Vogue, we are committed to protecting your personal information. We believe in transparency and want you to understand exactly how we collect, use, and safeguard your data.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-12 text-zinc-600 leading-relaxed">
                    <section>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-700">
                                <UserCheck size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 m-0">Information We Collect</h2>
                        </div>
                        <p className="mb-4">
                            We collect information you provide directly to us, such as when you create an account, place an order, or subscribe to our newsletter. This may include your name, email address, shipping address, payment information, and phone number.
                        </p>
                        <p>
                            We also automatically collect certain information about your device and how you interact with our website, such as your IP address, browser type, and pages visited.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-700">
                                <Lock size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 m-0">How We Use Your Information</h2>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you about your account and transactions.</li>
                            <li>To improve our website and personalize your shopping experience.</li>
                            <li>To send you marketing communications (if you have opted in).</li>
                            <li>To detect and prevent fraud and abuse.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Data Security</h2>
                        <p>
                            We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption for sensitive data like payment details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Sharing Your Information</h2>
                        <p>
                            We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, and delivering orders, provided they agree to keep your information confidential.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                        <h2 className="text-xl font-bold text-zinc-900 mb-2">Contact Us</h2>
                        <p className="text-sm">
                            If you have any questions or concerns about our Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@villagevogue.com" className="text-indigo-600 font-bold hover:underline">privacy@villagevogue.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
