import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Edit, Package, Plus } from "lucide-react";

export default function ProductManagement() {
  const { supplier } = useAuth();
  const { toast } = useToast();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", { supplierId: supplier?.id }],
    enabled: !!supplier,
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PUT", `/api/products/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
    },
  });

  const toggleProductStatus = (productId: string, currentStatus: boolean) => {
    updateProductMutation.mutate({
      id: productId,
      updates: { isActive: !currentStatus },
    });
  };

  if (isLoading) {
    return (
      <Card className="border border-neutral-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-neutral-200 rounded-lg p-4">
                <Skeleton className="w-full h-32 rounded-lg mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32 mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockProducts = [
    {
      id: "1",
      name: "Red Onions",
      description: "Premium quality, 1 kg",
      pricePerUnit: "35",
      stockQuantity: 50,
      unit: "kg",
      isActive: true,
      image: "🧅",
    },
    {
      id: "2", 
      name: "Green Chilies",
      description: "Fresh and spicy, 1 kg",
      pricePerUnit: "80",
      stockQuantity: 5,
      unit: "kg",
      isActive: true,
      image: "🌶️",
    },
    {
      id: "3",
      name: "Basmati Rice",
      description: "Premium quality, 25 kg",
      pricePerUnit: "120",
      stockQuantity: 200,
      unit: "kg",
      isActive: true,
      image: "🍚",
    },
  ];

  const displayProducts = products?.length > 0 ? products : mockProducts;

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-neutral-800">
              Product Management
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Manage your inventory and listings</p>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayProducts.map((product: any) => (
            <div key={product.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="relative mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center text-4xl">
                  {product.image || "📦"}
                </div>
                <Badge 
                  className={`absolute top-2 right-2 text-xs ${
                    product.stockQuantity > 10 
                      ? "bg-green-100 text-green-800"
                      : product.stockQuantity > 0
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stockQuantity > 10 
                    ? "In Stock" 
                    : product.stockQuantity > 0 
                    ? "Low Stock" 
                    : "Out of Stock"}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">{product.name}</h4>
                <p className="text-sm text-neutral-500 mb-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-neutral-800">
                    ₹{product.pricePerUnit}/{product.unit}
                  </span>
                  <span className="text-sm text-neutral-500">
                    Stock: {product.stockQuantity} {product.unit}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Package className="mr-1 h-3 w-3" />
                    Orders
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No products yet</h3>
            <p className="text-neutral-500 mb-4">Start by adding your first product to the marketplace</p>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
