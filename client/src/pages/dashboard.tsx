import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import StatsOverview from "@/components/dashboard/stats-overview";
import ProductCategories from "@/components/dashboard/product-categories";
import NearbySuppliers from "@/components/dashboard/nearby-suppliers";
import PriceComparison from "@/components/dashboard/price-comparison";
import RecentOrders from "@/components/dashboard/recent-orders";
import InventoryAlerts from "@/components/inventory/inventory-alerts";
import { Search, Plus, Filter } from "lucide-react";

export default function Dashboard() {
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
            className="flex-1 bg-primary text-white"
            onClick={() => setLocation("/")}
          >
            Vendor View
          </Button>
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => setLocation("/supplier")}
          >
            Supplier View
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Dashboard Stats */}
        <StatsOverview />

        {/* Inventory Alerts */}
        <div className="mb-8">
          <InventoryAlerts />
        </div>

        {/* Quick Actions & Search */}
        <div className="mb-8">
          <Card className="border border-neutral-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input 
                      placeholder="Search products, suppliers..." 
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="whitespace-nowrap">
                    <Plus className="mr-2 h-4 w-4" />
                    New Order
                  </Button>
                  <Button variant="outline" className="whitespace-nowrap">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Categories & Suppliers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ProductCategories />
          <NearbySuppliers />
        </div>

        {/* Product Comparison & Orders */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PriceComparison />
          <RecentOrders />
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
