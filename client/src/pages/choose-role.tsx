import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Truck, ArrowRight } from "lucide-react";

export default function ChooseRole() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            Welcome to SupplyLink
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            The B2B marketplace connecting street food vendors with raw material suppliers
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vendor Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-orange-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <ChefHat className="h-10 w-10 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-neutral-800">Street Food Vendors</CardTitle>
              <CardDescription className="text-neutral-600">
                Source quality ingredients for your street food business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Browse verified suppliers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Compare prices and quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Place orders easily</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Track deliveries in real-time</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => setLocation("/vendor-login")}
                >
                  Login as Vendor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => setLocation("/vendor-login")}
                >
                  Register as Vendor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-neutral-800">Raw Material Suppliers</CardTitle>
              <CardDescription className="text-neutral-600">
                Connect with street food vendors and grow your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>List your products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Reach more customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Manage orders efficiently</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Get verified and trusted</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setLocation("/supplier-login")}
                >
                  Login as Supplier
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setLocation("/supplier-login")}
                >
                  Register as Supplier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-neutral-500">
          <p>Already have an account? Choose your role above to get started.</p>
          <p className="mt-2">
            Need help? Contact us at{" "}
            <a href="mailto:support@supplylink.com" className="text-blue-600 hover:underline">
              support@supplylink.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 