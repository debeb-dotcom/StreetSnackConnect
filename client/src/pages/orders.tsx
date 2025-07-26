import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Search, Package, Truck, Clock, MapPin, Phone, Eye, RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircle },
  processing: { bg: "bg-purple-100", text: "text-purple-800", icon: Package },
  in_transit: { bg: "bg-orange-100", text: "text-orange-800", icon: Truck },
  delivered: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
  cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
};

export default function Orders() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders", { vendorId: user?.id }],
    enabled: !!user,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PUT", `/api/orders/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully",
      });
    },
  });

  // Mock orders data with comprehensive details
  const mockOrders = [
    {
      id: "ORD-001",
      supplierId: "supplier1",
      vendorId: user?.id,
      status: "in_transit",
      totalAmount: "1250.00",
      items: [
        { productName: "Red Onions", quantity: 10, unit: "kg", pricePerUnit: 35, total: 350 },
        { productName: "Fresh Tomatoes", quantity: 20, unit: "kg", pricePerUnit: 45, total: 900 },
      ],
      deliveryAddress: "Main Street Food Court, Sector 15, Delhi",
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      actualDelivery: null,
      paymentMethod: "cod",
      paymentStatus: "pending",
      notes: "Please call before delivery",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      supplier: {
        businessName: "Sharma Vegetables",
        phone: "+91-9876543210",
        address: "Azadpur Mandi, Delhi",
        profileImage: "🏪",
      },
      trackingSteps: [
        { status: "pending", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), description: "Order placed" },
        { status: "confirmed", timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), description: "Order confirmed by supplier" },
        { status: "processing", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), description: "Order is being prepared" },
        { status: "in_transit", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), description: "Out for delivery" },
      ],
    },
    {
      id: "ORD-002",
      supplierId: "supplier2",
      vendorId: user?.id,
      status: "delivered",
      totalAmount: "850.00",
      items: [
        { productName: "Cooking Oil", quantity: 5, unit: "liter", pricePerUnit: 120, total: 600 },
        { productName: "Garam Masala", quantity: 1, unit: "kg", pricePerUnit: 250, total: 250 },
      ],
      deliveryAddress: "Food Street, Connaught Place, Delhi",
      estimatedDelivery: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 4 * 60 * 60 * 1000),
      paymentMethod: "cod",
      paymentStatus: "paid",
      notes: "",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      supplier: {
        businessName: "Oil Mart",
        phone: "+91-9654321098",
        address: "Chandni Chowk, Delhi",
        profileImage: "🛢️",
      },
      trackingSteps: [
        { status: "pending", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), description: "Order placed" },
        { status: "confirmed", timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), description: "Order confirmed" },
        { status: "processing", timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), description: "Order prepared" },
        { status: "in_transit", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), description: "Out for delivery" },
        { status: "delivered", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), description: "Successfully delivered" },
      ],
    },
    {
      id: "ORD-003",
      supplierId: "supplier3",
      vendorId: user?.id,
      status: "pending",
      totalAmount: "1500.00",
      items: [
        { productName: "Basmati Rice", quantity: 25, unit: "kg", pricePerUnit: 60, total: 1500 },
      ],
      deliveryAddress: "Rajouri Garden Market, Delhi",
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      actualDelivery: null,
      paymentMethod: "cod",
      paymentStatus: "pending",
      notes: "Urgent delivery required",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      supplier: {
        businessName: "Rice Palace",
        phone: "+91-9543210987",
        address: "Karol Bagh, Delhi",
        profileImage: "🍚",
      },
      trackingSteps: [
        { status: "pending", timestamp: new Date(Date.now() - 30 * 60 * 1000), description: "Order placed, awaiting confirmation" },
      ],
    },
  ];

  const displayOrders = orders?.length > 0 ? orders : mockOrders;

  // Filter and sort orders
  const filteredOrders = displayOrders
    .filter((order: any) => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.supplier?.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.items?.some((item: any) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "amount":
          return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleCancelOrder = (orderId: string) => {
    updateOrderMutation.mutate({
      id: orderId,
      updates: { status: "cancelled" },
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  const getETA = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) {
      return "Delivery time passed";
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">Orders</h1>
          <p className="text-neutral-500">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input 
                    placeholder="Search orders, suppliers, products..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="amount">Amount: High to Low</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4 md:space-y-6">
          {ordersLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-neutral-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                    </div>
                    <div className="lg:w-64">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 flex-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredOrders.map((order: any) => {
              const StatusIcon = statusColors[order.status as keyof typeof statusColors]?.icon || AlertCircle;
              const statusColor = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
              
              return (
                <Card key={order.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-neutral-800">Order #{order.id}</h3>
                            <Badge className={`${statusColor.bg} ${statusColor.text} text-xs`}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-sm text-neutral-500">
                            {getTimeAgo(new Date(order.createdAt))}
                          </span>
                        </div>
                        
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                            {order.supplier.profileImage || order.supplier.businessName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-800">{order.supplier.businessName}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-neutral-500">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{order.supplier.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>{order.supplier.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-neutral-800 mb-2">Items ({order.items.length})</h4>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-neutral-600">
                                  {item.productName} × {item.quantity} {item.unit}
                                </span>
                                <span className="font-medium">₹{item.total}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-neutral-500">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-neutral-600 mb-4">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{order.deliveryAddress}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Summary & Actions */}
                      <div className="lg:w-80 space-y-4">
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-neutral-600">Total Amount</span>
                            <span className="text-xl font-bold text-neutral-800">₹{order.totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Payment</span>
                            <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"} className="text-xs">
                              {order.paymentStatus.toUpperCase()} • {order.paymentMethod.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        {order.status === "in_transit" && order.estimatedDelivery && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Out for Delivery</span>
                            </div>
                            <p className="text-sm text-blue-700">
                              ETA: {getETA(new Date(order.estimatedDelivery))}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 xl:space-y-0 xl:space-x-2">
                          <Button variant="outline" className="flex-1">
                            <Eye className="mr-2 h-4 w-4" />
                            Track Order
                          </Button>
                          {(order.status === "pending" || order.status === "confirmed") && (
                            <Button 
                              variant="outline" 
                              className="flex-1 text-red-600 hover:text-red-700"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={updateOrderMutation.isPending}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button className="flex-1 bg-primary text-white hover:bg-primary/90">
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {filteredOrders.length === 0 && !ordersLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No orders found</h3>
            <p className="text-neutral-500 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Start browsing products to place your first order"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setLocation("/products")}>
                Browse Products
              </Button>
            )}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}