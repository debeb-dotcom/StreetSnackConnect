import { Link } from "wouter";
import { Home, Search, ShoppingCart, User } from "lucide-react";

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        <Link href="/">
          <a className="flex flex-col items-center py-2 px-3 text-primary">
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </a>
        </Link>
        <Link href="/products">
          <a className="flex flex-col items-center py-2 px-3 text-neutral-400">
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs">Search</span>
          </a>
        </Link>
        <Link href="/orders">
          <a className="flex flex-col items-center py-2 px-3 text-neutral-400">
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">Orders</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className="flex flex-col items-center py-2 px-3 text-neutral-400">
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
