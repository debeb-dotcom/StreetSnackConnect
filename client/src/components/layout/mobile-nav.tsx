import { Link } from "wouter";
import { Home, Search, ShoppingCart, User } from "lucide-react";

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        <Link href="/">
          <span className="flex flex-col items-center py-2 px-3 text-primary cursor-pointer">
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </span>
        </Link>
        <Link href="/products">
          <span className="flex flex-col items-center py-2 px-3 text-neutral-400 cursor-pointer">
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs">Products</span>
          </span>
        </Link>
        <Link href="/orders">
          <span className="flex flex-col items-center py-2 px-3 text-neutral-400 cursor-pointer">
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">Orders</span>
          </span>
        </Link>
        <Link href="/suppliers">
          <span className="flex flex-col items-center py-2 px-3 text-neutral-400 cursor-pointer">
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Suppliers</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
