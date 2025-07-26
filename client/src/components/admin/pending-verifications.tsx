import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function PendingVerifications() {
  const { toast } = useToast();
  
  const { data: pendingSuppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers/pending"],
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PUT", `/api/suppliers/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "Supplier updated",
        description: "Supplier verification status has been updated",
      });
    },
  });

  const handleApprove = (supplierId: string) => {
    updateSupplierMutation.mutate({
      id: supplierId,
      updates: { 
        isVerified: true, 
        verificationStatus: "approved" 
      },
    });
  };

  const handleReject = (supplierId: string) => {
    updateSupplierMutation.mutate({
      id: supplierId,
      updates: { 
        isVerified: false, 
        verificationStatus: "rejected" 
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border border-neutral-200">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demo
  const mockPendingSuppliers = [
    {
      id: "1",
      businessName: "Kumar General Store",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      address: "Delhi",
    },
    {
      id: "2", 
      businessName: "Fresh Meat Corner",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      address: "Mumbai",
    },
  ];

  const displaySuppliers = pendingSuppliers?.length > 0 ? pendingSuppliers : mockPendingSuppliers;

  return (
    <Card className="border border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-xl font-semibold text-neutral-800">
          Pending Verifications
        </CardTitle>
        <p className="text-sm text-neutral-500 mt-1">Suppliers awaiting approval</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          {displaySuppliers.map((supplier: any) => (
            <div 
              key={supplier.id}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {supplier.businessName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{supplier.businessName}</p>
                  <p className="text-xs text-neutral-500">
                    Applied {Math.floor((Date.now() - new Date(supplier.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => handleApprove(supplier.id)}
                  disabled={updateSupplierMutation.isPending}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Approve
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(supplier.id)}
                  disabled={updateSupplierMutation.isPending}
                >
                  <X className="mr-1 h-3 w-3" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>

        {displaySuppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">No pending verifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
