import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingCart, Truck, Star, IndianRupee } from "lucide-react";

export default function StatsOverview() {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery({
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

  const statItems = [
    {
      title: "Active Orders",
      value: stats?.activeOrders || 0,
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Nearby Suppliers",
      value: stats?.nearbySuppliers || 0,
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avg Rating",
      value: stats?.avgRating || "0.0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Monthly Savings",
      value: stats?.monthlySavings || "₹0",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="border border-neutral-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`${item.color} h-6 w-6`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">{item.title}</p>
                <p className="text-2xl font-bold text-neutral-800">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
