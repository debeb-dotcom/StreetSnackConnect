import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, ShoppingCart, X, RefreshCw, Package } from "lucide-react";

interface InventoryAlert {
  id: string;
  productName: string;
  currentStock: number;
  unit: string;
  threshold: number;
  supplier: string;
  lastOrderDate?: Date;
  avgWeeklyUsage: number;
  daysUntilEmpty: number;
  urgency: "low" | "medium" | "high" | "critical";
}

export default function InventoryAlerts() {
  const { user } = useAuth();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Mock inventory alerts with realistic data
  const mockAlerts: InventoryAlert[] = [
    {
      id: "alert1",
      productName: "Red Onions",
      currentStock: 3,
      unit: "kg",
      threshold: 10,
      supplier: "Sharma Vegetables",
      lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      avgWeeklyUsage: 25,
      daysUntilEmpty: 1,
      urgency: "critical",
    },
    {
      id: "alert2",
      productName: "Fresh Tomatoes",
      currentStock: 8,
      unit: "kg",
      threshold: 15,
      supplier: "Garden Fresh",
      lastOrderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      avgWeeklyUsage: 35,
      daysUntilEmpty: 2,
      urgency: "high",
    },
    {
      id: "alert3",
      productName: "Green Chilies",
      currentStock: 2,
      unit: "kg",
      threshold: 5,
      supplier: "Spice World",
      lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      avgWeeklyUsage: 8,
      daysUntilEmpty: 2,
      urgency: "high",
    },
    {
      id: "alert4",
      productName: "Garam Masala",
      currentStock: 1,
      unit: "kg",
      threshold: 3,
      supplier: "Spice World",
      lastOrderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      avgWeeklyUsage: 2,
      daysUntilEmpty: 4,
      urgency: "medium",
    },
    {
      id: "alert5",
      productName: "Cooking Oil",
      currentStock: 12,
      unit: "liter",
      threshold: 20,
      supplier: "Oil Mart",
      lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      avgWeeklyUsage: 15,
      daysUntilEmpty: 6,
      urgency: "low",
    },
  ];

  const { data: inventoryAlerts } = useQuery({
    queryKey: ["/api/inventory/alerts", user?.id],
    enabled: !!user,
    initialData: mockAlerts,
  });

  const visibleAlerts = (inventoryAlerts || []).filter(
    (alert: InventoryAlert) => !dismissedAlerts.has(alert.id)
  );

  const urgencyColors = {
    critical: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
    high: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
    low: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  };

  const urgencyMessages = {
    critical: "Stock critically low! Order immediately",
    high: "Stock running low - order soon",
    medium: "Stock below threshold - consider reordering",
    low: "Stock getting low - plan next order",
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getStockPercentage = (current: number, threshold: number) => {
    return Math.min(100, (current / threshold) * 100);
  };

  const formatLastOrder = (date?: Date) => {
    if (!date) return "Never";
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const handleQuickOrder = (alert: InventoryAlert) => {
    // In a real app, this would open an order modal or redirect to supplier
    console.log(`Quick order for ${alert.productName} from ${alert.supplier}`);
  };

  if (visibleAlerts.length === 0) {
    return (
      <Card className="border border-neutral-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 text-green-600">
            <Package className="h-5 w-5" />
            <span className="font-medium">All inventory levels are healthy!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-xl font-semibold text-neutral-800">
              Inventory Alerts
            </CardTitle>
            <Badge className="bg-orange-100 text-orange-800">
              {visibleAlerts.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-neutral-500">Items that need restocking</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          {visibleAlerts.map((alert) => {
            const colors = urgencyColors[alert.urgency];
            const stockPercentage = getStockPercentage(alert.currentStock, alert.threshold);
            
            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-neutral-800">{alert.productName}</h4>
                      <Badge className={`${colors.bg} ${colors.text} text-xs border-0`}>
                        {alert.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`text-sm ${colors.text} mb-2`}>
                      {urgencyMessages[alert.urgency]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Current Stock:</span>
                    <p className="font-semibold">
                      {alert.currentStock} {alert.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Threshold:</span>
                    <p className="font-semibold">
                      {alert.threshold} {alert.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Days Until Empty:</span>
                    <p className="font-semibold text-red-600">
                      {alert.daysUntilEmpty} days
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Supplier:</span>
                    <p className="font-semibold">{alert.supplier}</p>
                  </div>
                </div>
                
                {/* Stock Level Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span>Stock Level</span>
                    <span>{Math.round(stockPercentage)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        stockPercentage <= 25 ? 'bg-red-500' :
                        stockPercentage <= 50 ? 'bg-orange-500' :
                        stockPercentage <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.max(5, stockPercentage)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="text-xs text-neutral-600">
                    <span>Last ordered: {formatLastOrder(alert.lastOrderDate)}</span>
                    <span className="mx-2">•</span>
                    <span>Weekly usage: ~{alert.avgWeeklyUsage} {alert.unit}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
                    onClick={() => handleQuickOrder(alert)}
                  >
                    <ShoppingCart className="mr-2 h-3 w-3" />
                    Quick Order
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {dismissedAlerts.size > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDismissedAlerts(new Set())}
              className="text-xs"
            >
              Show {dismissedAlerts.size} dismissed alert{dismissedAlerts.size !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}