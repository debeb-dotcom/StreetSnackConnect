import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import VendorLogin from "@/pages/vendor-login";
import SupplierLogin from "@/pages/supplier-login";
import ChooseRole from "@/pages/choose-role";
import Products from "@/pages/products";
import Suppliers from "@/pages/suppliers";
import Orders from "@/pages/orders";
import Cart from "@/pages/cart";
import SupplierDashboard from "@/pages/supplier-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/vendor-login" component={VendorLogin} />
      <Route path="/supplier-login" component={SupplierLogin} />
      <Route path="/choose-role" component={ChooseRole} />
      <Route path="/products" component={Products} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/orders" component={Orders} />
      <Route path="/cart" component={Cart} />
      <Route path="/supplier" component={SupplierDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
