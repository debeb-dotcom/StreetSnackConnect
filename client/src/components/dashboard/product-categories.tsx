import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Droplets, Flame, Milk, Wheat, Drumstick } from "lucide-react";

const categoryIcons = {
  "Vegetables": Leaf,
  "Oils": Droplets,
  "Spices": Flame,
  "Dairy": Milk,
  "Grains": Wheat,
  "Meat": Drumstick,
};

const categoryColors = {
  "Vegetables": { icon: "text-green-600", bg: "bg-green-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
  "Oils": { icon: "text-yellow-600", bg: "bg-yellow-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
  "Spices": { icon: "text-red-600", bg: "bg-red-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
  "Dairy": { icon: "text-blue-600", bg: "bg-blue-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
  "Grains": { icon: "text-amber-600", bg: "bg-amber-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
  "Meat": { icon: "text-pink-600", bg: "bg-pink-100", hover: "group-hover:bg-primary/10 group-hover:text-primary" },
};

export default function ProductCategories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <Card className="border border-neutral-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border border-neutral-200 rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-lg mb-3" />
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <Card className="border border-neutral-200">
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="text-xl font-semibold text-neutral-800">
            Product Categories
          </CardTitle>
          <p className="text-sm text-neutral-500 mt-1">Browse raw materials by category</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories?.map((category: any) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Leaf;
              const colors = categoryColors[category.name as keyof typeof categoryColors] || categoryColors.Vegetables;
              
              return (
                <div 
                  key={category.id}
                  className="group cursor-pointer p-4 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-3 ${colors.hover}`}>
                    <IconComponent className={`${colors.icon} h-6 w-6 transition-colors ${colors.hover}`} />
                  </div>
                  <h3 className="font-medium text-neutral-800 mb-1">{category.name}</h3>
                  <p className="text-xs text-neutral-500">
                    {Math.floor(Math.random() * 100 + 20)} products
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
