"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, ShoppingBag, Store, Loader2, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/primary/Button';
import { Input } from '@/components/primary/Input';
import api from '@/services/api';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');

        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'customer'
            };

            const response = await api.post('/auth/register', signupData);

            // Auto login after registration
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));

            // Always redirect to home page for customers
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[40px] p-10 shadow-2xl shadow-zinc-200 border border-zinc-100"
            >
                <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-8 transition-colors">
                    <ArrowLeft size={14} className="mr-2" /> Back to Shop
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">Create Account</h1>
                    <p className="text-zinc-500 font-medium lowercase">Join our community of style enthusiasts.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-black uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.01]"
                        size="lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-indigo-600 font-black hover:underline ml-1">
                            Access Portal
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
