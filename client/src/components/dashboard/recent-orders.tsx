import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  in_transit: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function RecentOrders() {
  const { user } = useAuth();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders", { vendorId: user?.id }],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="border border-neutral-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-neutral-800">
              Recent Orders
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Track your order status</p>
          </div>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            View All
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          {orders?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500">No orders found</p>
              <p className="text-sm text-neutral-400 mt-1">Start browsing products to place your first order</p>
            </div>
          ) : (
            orders?.slice(0, 3).map((order: any) => (
              <div key={order.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Order #{order.id}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    className={`text-xs ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending}`}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">
                      {Array.isArray(order.items) ? order.items.length : 0} items
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-800">₹{order.totalAmount}</p>
                    <p className="text-xs text-neutral-500">
                      {order.status === 'in_transit' ? 'ETA: 2 hrs' : 
                       order.status === 'delivered' ? 'Delivered' : 
                       order.status === 'processing' ? 'Processing' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
