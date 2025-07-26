import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

import { ShoppingCart, Truck, Star, IndianRupee } from "lucide-react";


interface DashboardStats {
  activeOrdersVendor?: number;
  activeOrdersSupplier?: number;
  nearbySuppliersCount?: number;
  nearbySuppliersAvgRating?: string;
  avgRating?: string;
  monthlySavings?: string;
}

export default function StatsOverview() {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", user?.id, user?.role],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Split card for active orders
  const activeOrdersCard = (
    <Card className="border border-neutral-200 col-span-1">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-500">Vendor Active Orders</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.activeOrdersVendor ?? 0}</p>
          </div>
          <div className="flex-1 border-l pl-4 ml-4">
            <p className="text-sm font-medium text-neutral-500">Supplier Active Orders</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.activeOrdersSupplier ?? 0}</p>
          </div>
          <div className="ml-4">
            <ShoppingCart className="text-primary h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Combined card for nearby suppliers and avg rating
  const nearbySuppliersCard = (
    <Card className="border border-neutral-200 col-span-1">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="text-green-600 h-6 w-6" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-500">Nearby Suppliers</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.nearbySuppliersCount ?? 0}</p>
            <p className="text-xs text-neutral-500 mt-1">Avg Rating: <span className="font-semibold text-yellow-600">{stats?.nearbySuppliersAvgRating ?? "0.0"} ★</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Avg rating card
  const avgRatingCard = (
    <Card className="border border-neutral-200 col-span-1">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="text-yellow-600 h-6 w-6" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-500">Avg Rating</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.avgRating ?? "0.0"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Monthly savings card
  const monthlySavingsCard = (
    <Card className="border border-neutral-200 col-span-1">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="text-green-600 h-6 w-6" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-500">Monthly Savings</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.monthlySavings ?? "₹0"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {activeOrdersCard}
      {nearbySuppliersCard}
      {avgRatingCard}
      {monthlySavingsCard}
    </div>
  );
}
