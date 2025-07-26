import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import PendingVerifications from "@/components/admin/pending-verifications";
import PlatformAnalytics from "@/components/admin/platform-analytics";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Dashboard Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Admin Control Panel</h2>
          <p className="text-neutral-500">Monitor platform activity and manage verifications</p>
        </div>

        {/* Admin Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PendingVerifications />
          <PlatformAnalytics />
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
