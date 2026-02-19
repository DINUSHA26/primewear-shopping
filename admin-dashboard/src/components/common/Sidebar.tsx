"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuLayoutDashboard, LuUsers, LuShirt, LuShoppingCart, LuSettings, LuLogOut, LuPlus, LuStore } from 'react-icons/lu';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';

  const menuItems = [
    { name: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard', show: true },
    { name: 'Garment Owners', icon: <LuStore />, path: '/vendors', show: isAdmin },
    { name: 'Customer Manager', icon: <LuUsers />, path: '/customers', show: isAdmin },
    { name: 'All Products', icon: <LuShirt />, path: '/products', show: isAdmin },
    { name: 'Manage Products', icon: <LuPlus />, path: '/products-manage', show: isVendor },
    { name: 'Order List', icon: <LuShoppingCart />, path: '/orders', show: true },
    { name: 'Settings', icon: <LuSettings />, path: '/settings', show: true },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 h-screen sticky top-0 flex flex-col z-20 transition-colors">
      <div className="p-6">
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">A</span>
          Garment Portal
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.filter(item => item.show).map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-100 dark:shadow-none"
                : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-900/10 transition-colors"
        >
          <LuLogOut className="text-xl" />
          Logout
        </button>
        <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center mt-4 uppercase tracking-widest font-bold">
          © 2026 Admin Panel
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;