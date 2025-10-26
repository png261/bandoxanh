'use client';

import { UserButton as ClerkUserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LeafIcon } from './Icons';
import { useEffect, useState } from 'react';

interface UserButtonProps {
  isCollapsed?: boolean;
}

export default function UserButtonComponent({ isCollapsed = false }: UserButtonProps) {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleProfileClick = () => {
    if (currentUserId) {
      router.push(`/profile/${currentUserId}`);
      setIsDropdownOpen(false);
    }
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
        <div className="relative w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`hover:opacity-75 transition-opacity ${isCollapsed ? 'flex justify-center w-full' : ''}`}
          >
            <ClerkUserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 rounded-full',
                  userButtonTrigger: 'hover:opacity-75 transition-opacity',
                },
              }}
              afterSignOutUrl="/"
            />
          </button>
          {isDropdownOpen && currentUserId && (
            <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'right-0'} mt-2 w-48 bg-white dark:bg-brand-gray-dark rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 py-2`}>
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white"
              >
                Xem hồ sơ
              </button>
              <hr className="my-2 dark:border-gray-700" />
              <div className="px-4">
                <ClerkUserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 rounded-full',
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
