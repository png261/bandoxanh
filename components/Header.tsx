'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Theme } from '@/types';
import { MenuIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, SunIcon, MoonIcon, AdminIcon, InformationCircleIcon } from './Icons';
import { Map, Sparkles, Salad, Recycle, Users } from 'lucide-react';
import UserButton from './UserButton';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import Image from "next/image";
import logo from "@/public/logo.png";

interface HeaderProps {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
}

interface NavItemsProps {
  currentPath: string;
  navigateTo: (path: string) => void;
  onLinkClick?: () => void;
  isCollapsed?: boolean;
  isAdmin?: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ currentPath, navigateTo, onLinkClick, isCollapsed = false, isAdmin = false }) => {
  const navGroups = [
    {
      title: "",
      items: [
        { path: '/map', label: 'Bản đồ Xanh', icon: Map },
        { path: '/scan', label: 'Công cụ AI', icon: Sparkles },
        { path: '/vegetarian', label: 'Thực đơn xanh', icon: Salad },
        { path: '/diy', label: 'Đồ tái chế', icon: Recycle },
        { path: '/community', label: 'Cộng đồng', icon: Users },
        { path: '/about', label: 'Về dự án', icon: InformationCircleIcon },
      ]
    },
  ];


  // Add Admin group if user is admin
  if (isAdmin) {
    navGroups.push({
      title: "QUẢN TRỊ",
      items: [{ path: '/admin', label: 'Admin Dashboard', icon: AdminIcon }]
    });
  }

  return (
    <div className="space-y-6">
      {navGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {!isCollapsed && group.title && (
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {group.title}
            </h3>
          )}
          <div className="">
            {group.items.map(item => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() => {
                      navigateTo(item.path);
                      if (onLinkClick) onLinkClick();
                    }}
                    className={`w-full flex items-center text-left py-6 rounded-lg text-sm font-medium transition-colors ${isCollapsed ? 'px-2 justify-center' : 'px-6 mx-2 w-[calc(100%-16px)]'
                      } ${isActive
                        ? 'bg-brand-green/10 text-brand-green dark:bg-brand-green/20 dark:text-brand-green-light'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    <Icon className={`flex-shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                  </button>
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999] shadow-lg">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ isCollapsed, setCollapsed, theme, toggleTheme }) => {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin, loading } = useIsAdmin();

  console.log('Admin status:', { isAdmin, loading });

  const navigateTo = (path: string) => {
    window.scrollTo(0, 0);
    router.push(path);
  };

  return (
    <>
      {/* --- Sidebar for Desktop (Always Collapsed - Icon Only) --- */}
      <aside className="bg-white dark:bg-brand-gray-dark border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 flex-col z-30 hidden md:flex transition-all duration-300 w-20 overflow-visible">
        {/* Header with Logo */}
        <div className="flex justify-center items-center border-b dark:border-gray-700 h-20 overflow-hidden px-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigateTo('/map')}
          >
            <Image src={logo} alt="BandoXanh" width={40} height={40} className="rounded-xl" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-4 overflow-visible">
          <NavItems currentPath={pathname} navigateTo={navigateTo} isCollapsed={true} isAdmin={isAdmin} />
        </nav>

        {/* Footer with UserButton only */}
        <div className="p-2 border-t dark:border-gray-700">
          <UserButton isCollapsed={true} />
        </div>
      </aside>

      {/* --- Top Bar for Mobile --- */}
      <header className="bg-white dark:bg-brand-gray-dark border-b border-gray-200 dark:border-gray-700 w-full fixed top-0 left-0 z-40 md:hidden h-20 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between w-full">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/map')}>
            <Image src={logo} alt="BandoXanh Logo" width={100} height={50} />
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 z-50">
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* --- Mobile Menu Drawer --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <nav
            className="relative bg-white dark:bg-brand-gray-dark p-4 space-y-2 border-b border-gray-200 dark:border-gray-700 max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <NavItems currentPath={pathname} navigateTo={navigateTo} onLinkClick={() => setIsMobileMenuOpen(false)} isCollapsed={false} isAdmin={isAdmin} />
            <div className="pt-4 border-t dark:border-gray-700 space-y-2">
              {/* User Profile in Mobile Menu - Inline Actions */}
              <div className="pb-2">
                <UserButton isCollapsed={false} showActionsInline={true} />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
