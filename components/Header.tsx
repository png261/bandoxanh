'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Theme } from '@/types';
import { LeafIcon, MenuIcon, XIcon, HomeIcon, MapPinIcon, CameraIcon, CommunityIcon, NewspaperIcon, InformationCircleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, SunIcon, MoonIcon } from './Icons';
import UserButton from './UserButton';

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
}

const NavItems: React.FC<NavItemsProps> = ({ currentPath, navigateTo, onLinkClick, isCollapsed = false }) => {
  const navItemsList = [
    { path: '/map', label: 'Bản đồ', icon: MapPinIcon },
    { path: '/identify', label: 'Nhận diện', icon: CameraIcon },
    { path: '/community', label: 'Cộng đồng', icon: CommunityIcon },
    { path: '/news', label: 'Tin tức', icon: NewspaperIcon },
    { path: '/about', label: 'Về dự án', icon: InformationCircleIcon },
  ];

  return (
    <>
      {navItemsList.map(item => {
        const isActive = currentPath === item.path;
        const Icon = item.icon;
        return (
          <div key={item.path} className="relative group">
            <button
              onClick={() => {
                navigateTo(item.path);
                if (onLinkClick) onLinkClick();
              }}
              className={`w-full flex items-center text-left py-4 rounded-lg text-md font-medium transition-colors ${
                isCollapsed ? 'px-4 justify-center' : 'px-6'
              } ${
                isActive
                  ? 'bg-brand-green text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-brand-green-light dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {!isCollapsed && <span className="ml-4 whitespace-nowrap">{item.label}</span>}
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};


const Header: React.FC<HeaderProps> = ({ isCollapsed, setCollapsed, theme, toggleTheme }) => {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (path: string) => {
    window.scrollTo(0, 0);
    router.push(path);
  };

  return (
    <>
      {/* --- Sidebar for Desktop --- */}
      <aside className={`bg-white dark:bg-brand-gray-dark border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 flex-col z-30 hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-72'}`}>
        {/* Header with Logo and Toggle */}
        <div className={`flex items-center justify-between border-b dark:border-gray-700 h-20 overflow-hidden ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <div 
            className={`flex items-center cursor-pointer ${isCollapsed ? 'mx-auto' : ''}`}
            onClick={() => navigateTo('/')}
          >
            <LeafIcon className="h-8 w-8 text-brand-green flex-shrink-0" />
            {!isCollapsed && <h1 className="ml-3 text-2xl font-semibold text-gray-800 dark:text-white whitespace-nowrap">BandoXanh</h1>}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setCollapsed(true)} 
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Thu gọn sidebar"
            >
              <ChevronDoubleLeftIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Expand button for collapsed sidebar */}
        {isCollapsed && (
          <div className="px-2 pt-3">
            <button 
              onClick={() => setCollapsed(false)} 
              className="w-full flex items-center justify-center p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Mở rộng sidebar"
            >
              <ChevronDoubleRightIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
          <NavItems currentPath={pathname} navigateTo={navigateTo} isCollapsed={isCollapsed} />
        </nav>

        {/* Footer with UserButton and Theme Toggle */}
        <div className={`p-3 border-t dark:border-gray-700 space-y-2 ${isCollapsed ? '' : 'pb-4'}`}>
          <UserButton isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* --- Top Bar for Mobile --- */}
      <header className="bg-white dark:bg-brand-gray-dark border-b border-gray-200 dark:border-gray-700 w-full fixed top-0 left-0 z-40 md:hidden h-20 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between w-full">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
            <LeafIcon className="h-8 w-8 text-brand-green" />
            <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">BandoXanh</h1>
          </div>
          <div className="flex items-center gap-3">
            <UserButton />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 z-50">
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Drawer --- */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <nav 
                className="relative bg-white dark:bg-brand-gray-dark p-4 space-y-2 border-b border-gray-200 dark:border-gray-700"
            >
                <NavItems currentPath={pathname} navigateTo={navigateTo} onLinkClick={() => setIsMobileMenuOpen(false)} isCollapsed={false} />
                <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                  <button 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center px-6 py-4 rounded-lg text-md font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-green-light dark:hover:bg-gray-700"
                  >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                    <span className="ml-4">{theme === 'light' ? 'Giao diện Tối' : 'Giao diện Sáng'}</span>
                  </button>
                </div>
            </nav>
          </div>
      )}
    </>
  );
};

export default Header;
