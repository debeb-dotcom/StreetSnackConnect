import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Search, MapPin, Star, Phone, Clock, Store, Filter, MessageCircle } from "lucide-react";

export default function Suppliers() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ["/api/suppliers", { verified: true }],
  });

  // Mock suppliers data
  const mockSuppliers = [
    {
      id: "1",
      businessName: "Sharma Vegetables",
      description: "Fresh vegetables and fruits supplier serving street food vendors for over 10 years",
      address: "Azadpur Mandi, Delhi",
      rating: 4.8,
      totalRatings: 156,
      isVerified: true,
      phone: "+91-9876543210",
      categories: ["Vegetables", "Fruits"],
      distance: "2.5 km",
      deliveryTime: "30-45 mins",
      minimumOrder: "₹500",
      totalProducts: 45,
      openTime: "5:00 AM - 8:00 PM",
      profileImage: "🏪",
    },
    {
      id: "2",
      businessName: "Garden Fresh",
      description: "Premium quality vegetables and organic produce supplier",
      address: "Sadar Bazaar, Delhi",
      rating: 4.6,
      totalRatings: 98,
      isVerified: true,
      phone: "+91-9765432109",
      categories: ["Vegetables", "Organic"],
      distance: "1.8 km",
      deliveryTime: "20-30 mins",
      minimumOrder: "₹300",
      totalProducts: 32,
      openTime: "6:00 AM - 9:00 PM",
      profileImage: "🌱",
    },
    {
      id: "3",
      businessName: "Oil Mart",
      description: "Cooking oils, refined oils, and edible oil supplier",
      address: "Chandni Chowk, Delhi",
      rating: 4.7,
      totalRatings: 203,
      isVerified: true,
      phone: "+91-9654321098",
      categories: ["Oils", "Spices"],
      distance: "3.2 km",
      deliveryTime: "45-60 mins",
      minimumOrder: "₹1000",
      totalProducts: 28,
      openTime: "7:00 AM - 7:00 PM",
      profileImage: "🛢️",
    },
    {
      id: "4",
      businessName: "Rice Palace",
      description: "Premium basmati rice, grains, and pulses supplier",
      address: "Karol Bagh, Delhi",
      rating: 4.9,
      totalRatings: 87,
      isVerified: true,
      phone: "+91-9543210987",
      categories: ["Grains", "Pulses"],
      distance: "4.1 km",
      deliveryTime: "60-75 mins",
      minimumOrder: "₹800",
      totalProducts: 18,
      openTime: "8:00 AM - 6:00 PM",
      profileImage: "🍚",
    },
    {
      id: "5",
      businessName: "Spice World",
      description: "Authentic Indian spices, masalas, and seasonings",
      address: "Khari Baoli, Delhi",
      rating: 4.5,
      totalRatings: 142,
      isVerified: true,
      phone: "+91-9432109876",
      categories: ["Spices", "Masalas"],
      distance: "2.8 km",
      deliveryTime: "40-50 mins",
      minimumOrder: "₹400",
      totalProducts: 67,
      openTime: "9:00 AM - 8:00 PM",
      profileImage: "🌶️",
    },
    {
      id: "6",
      businessName: "Fresh Meat Corner",
      description: "Fresh chicken, mutton, and seafood supplier",
      address: "Lajpat Nagar, Delhi",
      rating: 4.4,
      totalRatings: 76,
      isVerified: false,
      phone: "+91-9321098765",
      categories: ["Meat", "Seafood"],
      distance: "5.2 km",
      deliveryTime: "90 mins",
      minimumOrder: "₹600",
      totalProducts: 22,
      openTime: "6:00 AM - 10:00 PM",
      profileImage: "🥩",
    },
  ];

  const displaySuppliers = Array.isArray(suppliers) && suppliers.length > 0 ? suppliers : mockSuppliers;

  // Filter and sort suppliers
  const filteredSuppliers = Array.isArray(displaySuppliers) ? displaySuppliers
    .filter((supplier: any) => {
      const matchesSearch = supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.categories?.some((cat: string) => cat.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesFilter = true;
      switch (selectedFilter) {
        case "verified":
          matchesFilter = supplier.isVerified;
          break;
        case "nearby":
          matchesFilter = parseFloat(supplier.distance?.split(" ")[0] || "10") <= 3;
          break;
        case "fast_delivery":
          matchesFilter = parseInt(supplier.deliveryTime?.split("-")[0] || "60") <= 30;
          break;
        default:
          matchesFilter = true;
      }
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "distance":
          return parseFloat(a.distance?.split(" ")[0] || "10") - parseFloat(b.distance?.split(" ")[0] || "10");
        case "name":
          return a.businessName.localeCompare(b.businessName);
        case "delivery_time":
          return parseInt(a.deliveryTime?.split("-")[0] || "60") - parseInt(b.deliveryTime?.split("-")[0] || "60");
        default:
          return 0;
      }
    }) : [];

  // Button handlers
  const handleMoreFilters = () => {
    toast({ title: "More Filters", description: "Filter functionality coming soon!" });
  };
  const handleViewProducts = (supplier: any) => {
    // Navigate to the products page with supplier id as a query param
    setLocation(`/products?supplierId=${supplier.id}`);
  };
  const handlePhone = (supplier: any) => {
    // Open phone dialer (works on mobile)
    window.open(`tel:${supplier.phone}`);
  };
  const handleMessage = (supplier: any) => {
    // Open WhatsApp chat if phone exists, else show a toast
    if (supplier.phone) {
      window.open(`https://wa.me/${supplier.phone.replace(/[^\d]/g, "")}`);
    } else {
      toast({ title: `No phone number for ${supplier.businessName}` });
    }
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
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">Suppliers</h1>
          <p className="text-neutral-500">Find verified suppliers in your area</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input 
                    placeholder="Search suppliers, categories..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="nearby">Nearby (≤3km)</SelectItem>
                    <SelectItem value="fast_delivery">Fast Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                    <SelectItem value="distance">Distance: Near to Far</SelectItem>
                    <SelectItem value="delivery_time">Fastest Delivery</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="whitespace-nowrap" onClick={handleMoreFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {suppliersLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-neutral-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredSuppliers.map((supplier: any) => (
              <Card key={supplier.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {supplier.profileImage || supplier.businessName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-neutral-800 truncate">{supplier.businessName}</h3>
                        {supplier.isVerified && (
                          <Badge className="bg-green-100 text-green-800 text-xs ml-2 flex-shrink-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-neutral-700 ml-1">
                            {supplier.rating || "4.5"}
                          </span>
                          <span className="text-xs text-neutral-500 ml-1">
                            ({supplier.totalRatings || 0})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{supplier.distance || "Nearby"}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{supplier.deliveryTime || "45 mins"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {supplier.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {supplier.categories?.slice(0, 3).map((category: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {supplier.categories?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{supplier.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Min Order:</span>
                      <p className="font-medium">{supplier.minimumOrder || "₹500"}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Products:</span>
                      <p className="font-medium">{supplier.totalProducts || 0}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-neutral-500 mb-4">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {supplier.openTime || "9:00 AM - 6:00 PM"}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={() => handleViewProducts(supplier)}>
                      <Store className="mr-2 h-4 w-4" />
                      View Products
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePhone(supplier)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMessage(supplier)}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredSuppliers.length === 0 && !suppliersLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No suppliers found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}