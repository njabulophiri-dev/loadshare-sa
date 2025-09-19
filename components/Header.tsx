import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-gray-900">
              LoadShare SA
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/search"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
          >
            Find a Spot
          </Link>
          <Link
            href="/business/1"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
          >
            For Businesses
          </Link>
        </div>
      </nav>
    </header>
  );
}
