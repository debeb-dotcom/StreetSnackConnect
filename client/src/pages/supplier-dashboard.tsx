import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import ProductManagement from "@/components/supplier/product-management";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  // Fetch outgoing orders for this supplier
  const { toast } = useToast();
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders", { supplierId: user?.id }],
    enabled: !!user,
  });
  // Mock outgoing orders for demo
  const mockOrders = [
    {
      id: "ORD-001",
      vendorName: "Vendor A",
      status: "in_transit",
      totalAmount: "1250.00",
      deliveryAddress: "Main Street Food Court, Sector 15, Delhi",
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      trackingSteps: [
        { status: "pending", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), description: "Order placed" },
        { status: "confirmed", timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), description: "Order confirmed by supplier" },
        { status: "processing", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), description: "Order is being prepared" },
        { status: "in_transit", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), description: "Out for delivery" },
      ],
    },
    {
      id: "ORD-002",
      vendorName: "Vendor B",
      status: "delivered",
      totalAmount: "850.00",
      deliveryAddress: "Food Street, Connaught Place, Delhi",
      estimatedDelivery: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      trackingSteps: [
        { status: "pending", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), description: "Order placed" },
        { status: "confirmed", timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), description: "Order confirmed" },
        { status: "processing", timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), description: "Order prepared" },
        { status: "in_transit", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), description: "Out for delivery" },
        { status: "delivered", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), description: "Successfully delivered" },
      ],
    },
  ];
  const outgoingOrders = Array.isArray(orders) && orders.length > 0 ? orders : mockOrders;

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

        {/* Outgoing Orders Tracking */}
        <div className="mt-12">
          <Card className="border border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Outgoing Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outgoingOrders.length === 0 ? (
                <div className="text-center text-neutral-500 py-8">No outgoing shipments yet.</div>
              ) : (
                <div className="space-y-4">
                  {outgoingOrders.map((order: any) => (
                    <div key={order.id} className="border border-neutral-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="font-medium text-neutral-800">Order #{order.id}</div>
                        <div className="text-sm text-neutral-500">To: {order.vendorName}</div>
                        <div className="text-sm text-neutral-500">Address: {order.deliveryAddress}</div>
                        <div className="text-sm text-neutral-500">Status: <span className="capitalize">{order.status.replace('_', ' ')}</span></div>
                        <div className="text-sm text-neutral-500">ETA: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString() : "-"}</div>
                      </div>
                      <Button variant="outline" onClick={() => toast({ title: `Tracking for Order #${order.id}`, description: order.trackingSteps.map((step: any) => `${step.status}: ${step.description}`).join('\n') })}>
                        <Eye className="mr-2 h-4 w-4" /> Track
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
