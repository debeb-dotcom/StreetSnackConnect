import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function PlatformAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  if (isLoading) {
    return (
      <Card className="border border-neutral-200">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockAnalytics = {
    totalVendors: 1245,
    activeSuppliers: 389,
    monthlyOrders: 8567,
    revenue: "₹2.4M",
  };

  const displayAnalytics = analytics || mockAnalytics;

  const analyticsItems = [
    {
      label: "Total Vendors",
      value: displayAnalytics.totalVendors,
      change: "+12%",
      trend: "up",
    },
    {
      label: "Active Suppliers", 
      value: displayAnalytics.activeSuppliers,
      change: "+8%",
      trend: "up",
    },
    {
      label: "Monthly Orders",
      value: displayAnalytics.monthlyOrders?.toLocaleString(),
      change: "+25%",
      trend: "up",
    },
    {
      label: "Revenue",
      value: displayAnalytics.revenue,
      change: "+18%",
      trend: "up",
    },
  ];

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-xl font-semibold text-neutral-800">
          Platform Analytics
        </CardTitle>
        <p className="text-sm text-neutral-500 mt-1">Key metrics and insights</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {analyticsItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{item.label}</p>
                <p className="text-2xl font-bold text-neutral-800">{item.value}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {item.change} <TrendingUp className="ml-1 h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
