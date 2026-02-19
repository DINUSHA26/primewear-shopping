"use client";

import React, { useEffect, useState } from 'react';
import { LuBell, LuUser, LuSun, LuMoon, LuMenu } from 'react-icons/lu';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchNotifications();

      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      if (!notif.read) {
        await api.put(`/notifications/${notif._id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
      }

      if (notif.link) {
        router.push(notif.link);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <LuMenu size={24} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-zinc-700 transition-all flex items-center gap-2 group"
        >
          {mounted && (theme === 'dark' ? (
            <>
              <LuSun className="text-xl" />
              <span className="text-xs font-bold uppercase tracking-wider group-hover:block hidden sm:block">Light Mode</span>
            </>
          ) : (
            <>
              <LuMoon className="text-xl" />
              <span className="text-xs font-bold uppercase tracking-wider group-hover:block hidden sm:block">Dark Mode</span>
            </>
          ))}
          {!mounted && <div className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative text-gray-500 dark:text-zinc-400 hover:text-blue-600 transition-colors pt-2"
          >
            <LuBell className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-zinc-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div>
                          <p className={`text-sm ${!notif.read ? 'font-bold text-gray-800 dark:text-zinc-200' : 'text-gray-600 dark:text-zinc-400'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide font-medium">
                            {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3 border-l pl-4 md:pl-6 border-gray-100 dark:border-zinc-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 leading-none">
              {user?.name || 'Loading...'}
            </p>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              {user?.role === 'admin' ? 'Super Admin' : user?.garmentDetails?.garmentName || 'Vendor'}
            </span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
            <LuUser className="text-2xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;