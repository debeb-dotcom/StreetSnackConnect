import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/products", label: "Products", active: location === "/products" },
    { href: "/suppliers", label: "Suppliers", active: location === "/suppliers" },
    { href: "/orders", label: "Orders", active: location === "/orders" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">SupplyLink</h1>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active 
                      ? "text-neutral-800 bg-neutral-100" 
                      : "text-neutral-500 hover:text-primary"
                  }`}>
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-800">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-neutral-800 hidden lg:block">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled className="text-xs text-neutral-500">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="text-xs text-neutral-500">
                      Role: {user?.role}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={onMobileMenuToggle}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
