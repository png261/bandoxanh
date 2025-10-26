'use client';

import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LeafIcon, UserCircleIcon } from './Icons';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface UserButtonProps {
  isCollapsed?: boolean;
}

export default function UserButtonComponent({ isCollapsed = false }: UserButtonProps) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clerkUser?.id) {
      // Fetch user from database to get their ID
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${clerkUser.id}`);
          if (response.ok) {
            const data = await response.json();
            setCurrentUserId(data.id);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [clerkUser?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleProfileClick = () => {
    if (currentUserId) {
      router.push(`/profile/${currentUserId}`);
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
      <SignedOut>
        {!isCollapsed && (
          <>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-brand-green font-semibold hover:text-brand-green-dark transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-green-dark transition-colors"
            >
              Đăng ký
            </Link>
          </>
        )}
        {isCollapsed && (
          <Link
            href="/sign-in"
            className="p-2 text-brand-green hover:text-brand-green-dark transition-colors"
            title="Đăng nhập"
          >
            <LeafIcon className="w-6 h-6" />
          </Link>
        )}
      </SignedOut>

      <SignedIn>
        <div className="relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          >
            {clerkUser?.imageUrl ? (
              <Image
                src={clerkUser.imageUrl}
                alt={clerkUser.fullName || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
            )}
            {!isCollapsed && clerkUser && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {clerkUser.fullName || clerkUser.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {clerkUser.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </button>
          {isDropdownOpen && (
            <div className={`absolute ${isCollapsed ? 'left-full ml-2 bottom-0' : 'right-0 bottom-full mb-2'} w-56 bg-white dark:bg-brand-gray-dark rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 py-2`}>
              {/* User Info */}
              {clerkUser && !isCollapsed && (
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {clerkUser.imageUrl ? (
                      <Image
                        src={clerkUser.imageUrl}
                        alt={clerkUser.fullName || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {clerkUser.fullName || clerkUser.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {clerkUser.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Menu Items */}
              <div className="py-1">
                {currentUserId && (
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white flex items-center gap-2"
                  >
                    <UserCircleIcon className="w-4 h-4" />
                    Xem hồ sơ
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
