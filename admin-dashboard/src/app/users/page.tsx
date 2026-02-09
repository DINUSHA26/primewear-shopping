"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { LuCheck, LuX, LuUser, LuMail, LuPhone, LuStore, LuFileText, LuAlertCircle, LuPlus, LuMapPin, LuLock } from 'react-icons/lu';
import Button from '@/components/primary/Button';
import Input from '@/components/primary/Input';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectingUser, setRejectingUser] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Direct Register State
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        garmentName: '',
        businessRegNumber: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (userId: string) => {
        if (!confirm('Approve this corporate garment entity?')) return;
        try {
            await api.put(`/admin/users/${userId}/approve`);
            fetchUsers();
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return alert('Reason required for legal trail.');
        try {
            await api.put(`/admin/users/${rejectingUser}/reject`, { reason: rejectReason });
            setRejectingUser(null);
            setRejectReason('');
            fetchUsers();
        } catch (error) {
            console.error('Error rejecting user:', error);
        }
    };

    const handleDirectRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/vendors', registerData);
            setShowRegisterForm(false);
            setRegisterData({
                name: '', email: '', password: '', phoneNumber: '', address: '', garmentName: '', businessRegNumber: ''
            });
            fetchUsers();
            alert('Vendor Onboarded Successfully');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Onboarding Failed');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    const vendors = users.filter(u => u.role === 'vendor');
    const customers = users.filter(u => u.role === 'customer');

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black text-gray-900 tracking-tightest uppercase leading-none">Global Registry</h2>
                    <p className="text-gray-400 mt-3 font-bold uppercase tracking-[0.2em] text-[10px] italic">Control matrix for garment vendors and platform shoppers.</p>
                </div>
                <Button
                    onClick={() => setShowRegisterForm(true)}
                    className="bg-gray-900 text-white hover:bg-blue-600 shadow-2xl shadow-gray-200 py-4 px-8 rounded-2xl flex items-center gap-2 group transition-all"
                >
                    <LuPlus className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Onboard New Garment</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-16">
                {/* Vendors Section */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50 overflow-hidden">
                    <div className="p-10 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-4 tracking-tight">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100"><LuStore className="text-xl" /></div>
                            Corporate Entities
                        </h3>
                        <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                            Registry Volume: {vendors.length}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-50">
                                <tr>
                                    <th className="px-10 py-8">Entity Identity</th>
                                    <th className="px-10 py-8">Comm Matrix</th>
                                    <th className="px-10 py-8">Validation Assets</th>
                                    <th className="px-10 py-8">Compliance State</th>
                                    <th className="px-10 py-8 text-right">Direct Oversight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm font-bold">
                                {vendors.map((vendor) => (
                                    <tr key={vendor._id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                        <td className="px-10 py-8">
                                            <div className="text-lg font-black text-gray-900 tracking-tight leading-tight">{vendor.garmentDetails?.garmentName || 'PRIVATE ENTITY'}</div>
                                            <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <LuUser className="w-3 h-3 text-blue-500" /> REGISTRANT: {vendor.name}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 space-y-2">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {vendor.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                                                <LuPhone className="w-3.5 h-3.5" /> {vendor.phoneNumber || 'NO_AUTH_PH'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 flex flex-col gap-3">
                                            <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">BR:</span>
                                                <span className="text-[11px] font-mono font-black text-gray-800 uppercase">{vendor.garmentDetails?.businessRegNumber || 'UNSET'}</span>
                                            </div>
                                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4 flex items-center gap-2 hover:text-gray-900 transition-colors">
                                                <LuFileText className="w-3 h-3" /> Audit Documents
                                            </button>
                                        </td>
                                        <td className="px-10 py-8">
                                            {vendor.garmentDetails?.isApproved ? (
                                                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    Operational
                                                </span>
                                            ) : vendor.garmentDetails?.rejectionReason ? (
                                                <div className="space-y-2">
                                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                        Decommissioned
                                                    </span>
                                                    <p className="text-[10px] text-rose-300 italic font-medium px-2">"{vendor.garmentDetails.rejectionReason}"</p>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm animate-pulse">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                    Verification Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right space-x-3">
                                            {!vendor.garmentDetails?.isApproved ? (
                                                <>
                                                    <Button onClick={() => handleApprove(vendor._id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-50 text-[10px] py-3 px-6 rounded-2xl font-black">GRANT ACCESS</Button>
                                                    <Button onClick={() => setRejectingUser(vendor._id)} variant="danger" size="sm" className="text-[10px] py-3 px-6 rounded-2xl font-black border-rose-100">DECLINE</Button>
                                                </>
                                            ) : (
                                                <Button onClick={() => setRejectingUser(vendor._id)} variant="secondary" size="sm" className="text-[10px] font-black py-3 px-6 rounded-2xl text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all uppercase tracking-widest">Terminate</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Shoppers Registry */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50 overflow-hidden">
                    <div className="p-10 border-b border-gray-50 bg-gray-50/20">
                        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-4 tracking-tight">
                            <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-100"><LuUser className="text-xl" /></div>
                            Shopper Network
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <tr>
                                    <th className="px-10 py-8">Shopper Identity</th>
                                    <th className="px-10 py-8">Access Vector</th>
                                    <th className="px-10 py-8">Membership Span</th>
                                    <th className="px-10 py-8 text-right">Ledger Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-bold">
                                {customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-purple-50/20 transition-all duration-300">
                                        <td className="px-10 py-8 font-black text-gray-900 text-lg uppercase tracking-tight">{customer.name}</td>
                                        <td className="px-10 py-8 text-gray-600 text-sm">{customer.email}</td>
                                        <td className="px-10 py-8 text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td className="px-10 py-8 text-right font-black text-gray-800 text-base">0 ITEMS</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Direct Register Modal */}
            {showRegisterForm && (
                <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 py-20 overflow-y-auto">
                    <div className="bg-white rounded-[4rem] p-12 max-w-4xl w-full shadow-[0_50px_100px_-12px_rgba(0,0,0,0.5)] border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Garment Onboarding</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em]">Direct corporate entity registration protocol.</p>
                            </div>
                            <button onClick={() => setShowRegisterForm(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all rotate-45 group"><LuPlus className="text-2xl group-hover:rotate-90 transition-transform" /></button>
                        </div>

                        <form onSubmit={handleDirectRegister} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100 pb-2">Owner Intelligence</p>
                                <Input label="Proprietor Full Name" name="name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} icon={<LuUser />} required />
                                <Input label="Corporate Auth Email" name="email" type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} icon={<LuMail />} required />
                                <Input label="Secure Password Hash" name="password" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} icon={<LuLock />} required />
                                <Input label="Mobile Vector" name="phoneNumber" value={registerData.phoneNumber} onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })} icon={<LuPhone />} />
                            </div>
                            <div className="space-y-8">
                                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest border-b border-indigo-100 pb-2">Facility Specifications</p>
                                <Input label="Garment Corporate Name" name="garmentName" value={registerData.garmentName} onChange={(e) => setRegisterData({ ...registerData, garmentName: e.target.value })} icon={<LuStore />} required />
                                <Input label="Business Reg Code (LGL)" name="businessRegNumber" value={registerData.businessRegNumber} onChange={(e) => setRegisterData({ ...registerData, businessRegNumber: e.target.value })} icon={<LuFileText />} required />
                                <Input label="Physical HQ Address" name="address" value={registerData.address} onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} icon={<LuMapPin />} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-6 pt-10 border-t border-gray-50">
                                <Button variant="secondary" className="py-4 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-100" onClick={() => setShowRegisterForm(false)}>Abort Protocol</Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-black py-4 px-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all">Initiate Onboarding</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {rejectingUser && (
                <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl animate-bounce"><LuX className="text-3xl" /></div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Terminate Link</h3>
                        </div>
                        <p className="text-gray-500 mb-8 font-black uppercase tracking-widest text-[10px] leading-relaxed italic">Constructive reasoning required for account de-validation. Legal notified on confirmation.</p>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm font-black focus:ring-[12px] focus:ring-blue-100/50 focus:border-blue-400 transition-all outline-none mb-8 placeholder:text-gray-300"
                            placeholder="De-validation core reason..."
                            rows={4}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <Button variant="secondary" className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-100" onClick={() => setRejectingUser(null)}>Abort</Button>
                            <Button className="flex-1 bg-rose-600 hover:bg-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100" onClick={handleReject}>Terminate</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
