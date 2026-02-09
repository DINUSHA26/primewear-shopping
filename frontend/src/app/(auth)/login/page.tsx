"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/primary/Button';
import { Input } from '@/components/primary/Input';
import api from '@/services/api';

import { useCart } from '@/store/useCart';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        useCart.getState().clearCart();
        window.location.reload();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });

            // Save token and user info
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to home page
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (currentUser) {
        return (
            <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-zinc-200 border border-zinc-100 text-center"
                >
                    <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-6 text-2xl font-black text-indigo-600">
                        {currentUser.name?.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-black text-zinc-900 mb-2">Welcome back, {currentUser.name}!</h1>
                    <p className="text-zinc-500 mb-8 font-medium">{currentUser.email}</p>

                    <div className="space-y-4">
                        <Link href="/">
                            <Button className="w-full rounded-2xl py-4 font-bold">
                                Go to Shop
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="w-full rounded-2xl py-4 border-zinc-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-bold"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-zinc-200 border border-zinc-100"
            >
                <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-indigo-600 text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">Access Your Vogue</h1>
                    <p className="text-zinc-500 font-medium">Synchronize with our village garment network.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Auth Email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="space-y-1">
                        <Input
                            label="Auth Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                Reset Security Key?
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
                        size="lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Execute Login'}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        New to the Network?{' '}
                        <Link href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-indigo-600 font-black hover:underline ml-1">
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
