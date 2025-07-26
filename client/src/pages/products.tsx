import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Search, Filter, ShoppingCart, Star, MapPin, AlertTriangle } from "lucide-react";

export default function Products() {
  const { user, isLoading } = useAuth();
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = async (product: any) => {
    const quantity = quantities[product.id] || product.minOrderQuantity || 1;
    try {
      await addToCart(product.id, quantity, product.supplierId);
      setQuantities(prev => ({ ...prev, [product.id]: product.minOrderQuantity || 1 }));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { active: true }],
  });

  // Mock products with inventory alerts
  const mockProducts = [
    {
      id: "1",
      name: "Red Onions",
      description: "Premium quality red onions from local farms",
      pricePerUnit: "35",
      unit: "kg",
      stockQuantity: 150,
      minOrderQuantity: 10,
      categoryId: "vegetables",
      supplierId: "supplier1",
      imageUrl: "🧅",
      supplier: { businessName: "Sharma Vegetables", rating: 4.8, address: "2.5 km away" },
      lowStock: false,
    },
    {
      id: "2",
      name: "Fresh Tomatoes",
      description: "Ripe, juicy tomatoes perfect for street food",
      pricePerUnit: "45",
      unit: "kg",
      stockQuantity: 8,
      minOrderQuantity: 5,
      categoryId: "vegetables",
      supplierId: "supplier2",
      imageUrl: "🍅",
      supplier: { businessName: "Garden Fresh", rating: 4.6, address: "1.8 km away" },
      lowStock: true,
    },
    {
      id: "3",
      name: "Green Chilies",
      description: "Spicy green chilies, freshly harvested",
      pricePerUnit: "80",
      unit: "kg",
      stockQuantity: 3,
      minOrderQuantity: 2,
      categoryId: "vegetables",
      supplierId: "supplier1",
      imageUrl: "🌶️",
      supplier: { businessName: "Sharma Vegetables", rating: 4.8, address: "2.5 km away" },
      lowStock: true,
    },
    {
      id: "4",
      name: "Cooking Oil",
      description: "Refined sunflower oil for cooking",
      pricePerUnit: "120",
      unit: "liter",
      stockQuantity: 45,
      minOrderQuantity: 5,
      categoryId: "oils",
      supplierId: "supplier3",
      imageUrl: "🛢️",
      supplier: { businessName: "Oil Mart", rating: 4.7, address: "3.2 km away" },
      lowStock: false,
    },
    {
      id: "5",
      name: "Basmati Rice",
      description: "Premium quality basmati rice",
      pricePerUnit: "65",
      unit: "kg",
      stockQuantity: 200,
      minOrderQuantity: 25,
      categoryId: "grains",
      supplierId: "supplier4",
      imageUrl: "🍚",
      supplier: { businessName: "Rice Palace", rating: 4.9, address: "4.1 km away" },
      lowStock: false,
    },
    {
      id: "6",
      name: "Garam Masala",
      description: "Authentic spice blend for Indian cuisine",
      pricePerUnit: "250",
      unit: "kg",
      stockQuantity: 2,
      minOrderQuantity: 1,
      categoryId: "spices",
      supplierId: "supplier5",
      imageUrl: "🌶️",
      supplier: { businessName: "Spice World", rating: 4.5, address: "2.8 km away" },
      lowStock: true,
    },
  ];

  const displayProducts = products?.length > 0 ? products : mockProducts;

  // Inventory alerts
  const lowStockProducts = displayProducts.filter((product: any) => 
    product.stockQuantity <= 10 || product.lowStock
  );

  // Filter and sort products
  const filteredProducts = displayProducts
    .filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price":
          return parseFloat(a.pricePerUnit) - parseFloat(b.pricePerUnit);
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return (b.supplier?.rating || 0) - (a.supplier?.rating || 0);
        default:
          return 0;
      }
    });

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
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">Products</h1>
          <p className="text-neutral-500">Browse raw materials from verified suppliers</p>
        </div>

        {/* Inventory Alerts */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-800 mb-2">Inventory Alerts</h3>
                  <div className="space-y-1">
                    {lowStockProducts.slice(0, 3).map((product: any) => (
                      <p key={product.id} className="text-sm text-orange-700">
                        You're running low on {product.name}! Only {product.stockQuantity} {product.unit} left.
                      </p>
                    ))}
                    {lowStockProducts.length > 3 && (
                      <p className="text-sm text-orange-700">
                        +{lowStockProducts.length - 3} more items need restocking
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="whitespace-nowrap">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-neutral-200">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-32 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <Skeleton className="h-6 w-1/2 mb-3" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredProducts.map((product: any) => (
              <Card key={product.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center text-4xl">
                      {product.imageUrl || "📦"}
                    </div>
                    {(product.stockQuantity <= 10 || product.lowStock) && (
                      <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-neutral-800 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-neutral-800">
                        ₹{product.pricePerUnit}/{product.unit}
                      </span>
                      <span className="text-xs text-neutral-500">
                        Min: {product.minOrderQuantity} {product.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-neutral-600">{product.supplier?.rating || "4.5"}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-neutral-500">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{product.supplier?.address || "Nearby"}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      {product.supplier?.businessName || "Local Supplier"}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-2">
                      <span className="text-sm font-medium text-neutral-700">Quantity</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(
                            product.id, 
                            Math.max((quantities[product.id] || product.minOrderQuantity || 1) - 1, product.minOrderQuantity || 1)
                          )}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-12 text-center">
                          {quantities[product.id] || product.minOrderQuantity || 1} {product.unit}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(
                            product.id, 
                            (quantities[product.id] || product.minOrderQuantity || 1) + 1
                          )}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary/90"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add ₹{((quantities[product.id] || product.minOrderQuantity || 1) * parseFloat(product.pricePerUnit)).toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No products found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}