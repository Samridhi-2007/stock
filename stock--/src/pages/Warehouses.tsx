import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import WarehouseDialog from "@/components/WarehouseDialog";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  is_active: boolean;
}

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  const fetchWarehouses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("warehouses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch warehouses");
    } else {
      setWarehouses(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    const { error } = await supabase.from("warehouses").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete warehouse");
    } else {
      toast.success("Warehouse deleted successfully");
      fetchWarehouses();
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingWarehouse(null);
  };

  const handleWarehouseSaved = () => {
    fetchWarehouses();
    handleDialogClose();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage your warehouse locations
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <Card className="shadow-premium border-border/50">
        <CardHeader>
          <div className="text-sm text-muted-foreground">
            Total warehouses: {warehouses.length}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                Loading warehouses...
              </p>
            </div>
          ) : warehouses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No warehouses yet. Create your first warehouse to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono text-sm">
                        {warehouse.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {warehouse.name}
                      </TableCell>
                      <TableCell>{warehouse.address || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            warehouse.is_active
                              ? "badge-done"
                              : "badge-canceled"
                          }
                        >
                          {warehouse.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(warehouse)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(warehouse.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <WarehouseDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        warehouse={editingWarehouse}
        onSuccess={handleWarehouseSaved}
      />
    </div>
  );
};

export default Warehouses;
