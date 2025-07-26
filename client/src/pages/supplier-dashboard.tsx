import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import ProductManagement from "@/components/supplier/product-management";
import { Button } from "@/components/ui/button";

export default function SupplierDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Mobile Role Switcher */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => setLocation("/")}
          >
            Vendor View
          </Button>
          <Button 
            className="flex-1 bg-primary text-white"
            onClick={() => setLocation("/supplier")}
          >
            Supplier View
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Dashboard Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Supplier Dashboard</h2>
          <p className="text-neutral-500">Manage your products and orders efficiently</p>
        </div>

        {/* Product Management */}
        <ProductManagement />
      </div>

      <MobileNav />
    </div>
  );
}
