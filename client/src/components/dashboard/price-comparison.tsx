import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Store } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function PriceComparison() {
  const [selectedProduct] = useState({
    name: "Fresh Tomatoes",
    unit: "1 kg",
    image: "🍅",
  });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const priceComparisons = [
    {
      supplier: "Sharma Vegetables",
      rating: 4.8,
      price: 45,
      isBest: true,
    },
    {
      supplier: "Garden Fresh",
      rating: 4.6,
      price: 48,
      isBest: false,
    },
    {
      supplier: "Local Market",
      rating: 4.5,
      price: 52,
      isBest: false,
    },
  ];

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-xl font-semibold text-neutral-800">
          Price Comparison
        </CardTitle>
        <p className="text-sm text-neutral-500 mt-1">Compare prices across suppliers</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
              {selectedProduct.image}
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">{selectedProduct.name}</h3>
              <p className="text-sm text-neutral-500">{selectedProduct.unit}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {priceComparisons.map((comparison, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Store className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{comparison.supplier}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-neutral-500">{comparison.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-800">₹{comparison.price}</p>
                {comparison.isBest ? (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Best Price
                  </Badge>
                ) : (
                  <span className="text-xs text-neutral-500">
                    +₹{comparison.price - priceComparisons[0].price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button className="mt-4 w-full bg-primary text-white hover:bg-primary/90" onClick={async () => {
          await addToCart("1", 1, "supplier1"); // Example: productId "1", quantity 1, supplierId "supplier1"
          toast({ title: 'Added best price item to cart!' });
        }}>
          Add to Cart - Best Price ₹{priceComparisons[0].price}
        </Button>
      </CardContent>
    </Card>
  );
}
