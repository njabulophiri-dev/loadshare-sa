'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            LoadShare SA
          </Link>
          <div className="text-gray-500">Loading...</div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
          LoadShare SA
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/search" className="text-gray-700 hover:text-blue-600">
            Find Spots
          </Link>
          
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <span className="text-gray-700">Hi, {session.user?.name}</span>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
