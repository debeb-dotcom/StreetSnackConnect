import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

export default function NearbySuppliers() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers", { verified: true, limit: 5 }],
  });

  if (isLoading) {
    return (
      <div>
        <Card className="border border-neutral-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="border border-neutral-200">
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="text-xl font-semibold text-neutral-800">
            Nearby Suppliers
          </CardTitle>
          <p className="text-sm text-neutral-500 mt-1">Verified suppliers in your area</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-4">
            {suppliers?.map((supplier: any) => (
              <div 
                key={supplier.id}
                className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {supplier.businessName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {supplier.businessName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-neutral-500 ml-1">
                        {supplier.rating || "4.8"}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">•</span>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-500 ml-1">
                        {Math.floor(Math.random() * 3 + 1)}.{Math.floor(Math.random() * 9)} km
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Verified
                </Badge>
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full text-primary hover:text-primary/80 text-sm font-medium py-2 transition-colors">
            View All Suppliers
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
