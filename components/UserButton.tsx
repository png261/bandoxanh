'use client';

import { UserButton as ClerkUserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { LeafIcon } from './Icons';

export default function UserButtonComponent() {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
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
      </SignedOut>

      <SignedIn>
        <ClerkUserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10 rounded-full',
              userButtonTrigger: 'hover:opacity-75 transition-opacity',
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
}
