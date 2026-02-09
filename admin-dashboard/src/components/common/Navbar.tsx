"use client";

import React, { useEffect, useState } from 'react';
import { LuBell, LuSearch, LuUser } from 'react-icons/lu';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchNotifications();

      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

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
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl w-96 border border-gray-100 focus-within:border-blue-300 transition-all">
        <LuSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search analytics, orders..."
          className="bg-transparent outline-none text-sm w-full text-gray-700"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative text-gray-500 hover:text-blue-600 transition-colors pt-2"
          >
            <LuBell className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700"
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
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div>
                          <p className={`text-sm ${!notif.read ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
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

        <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">
              {user?.name || 'Loading...'}
            </p>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              {user?.role === 'admin' ? 'Super Admin' : user?.garmentDetails?.garmentName || 'Vendor'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <LuUser className="text-2xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;