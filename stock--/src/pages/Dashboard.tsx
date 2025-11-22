import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  FileText,
  Truck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  totalStockValue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    totalStockValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Fetch products count and low stock
      const { data: products } = await supabase.from("products").select("*");

      const totalProducts = products?.length || 0;
      const lowStockProducts =
        products?.filter((p) => p.current_stock <= p.reorder_level).length || 0;

      // Fetch pending receipts
      const { data: receipts } = await supabase
        .from("receipts")
        .select("*")
        .neq("status", "done")
        .neq("status", "canceled");

      // Fetch pending deliveries
      const { data: deliveries } = await supabase
        .from("deliveries")
        .select("*")
        .neq("status", "done")
        .neq("status", "canceled");

      setStats({
        totalProducts,
        lowStockProducts,
        pendingReceipts: receipts?.length || 0,
        pendingDeliveries: deliveries?.length || 0,
        totalStockValue: 0, // Can be calculated with product prices
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "In stock",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      description: "Need reordering",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Pending Receipts",
      value: stats.pendingReceipts,
      icon: FileText,
      description: "Incoming stock",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Pending Deliveries",
      value: stats.pendingDeliveries,
      icon: Truck,
      description: "Outgoing orders",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Loading your inventory overview...
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-premium animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your inventory management system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card
            key={kpi.title}
            className="shadow-premium hover:shadow-premium-lg transition-smooth border-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-premium border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display. Start by creating products or
              processing receipts.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-premium border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="badge-waiting">
                    Low Stock
                  </Badge>
                  <p className="text-sm">
                    {stats.lowStockProducts} product
                    {stats.lowStockProducts > 1 ? "s" : ""} below reorder level
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All stock levels are healthy.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
