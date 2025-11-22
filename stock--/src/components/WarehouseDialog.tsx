import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  is_active: boolean;
}

interface WarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
  onSuccess: () => void;
}

const WarehouseDialog = ({
  open,
  onOpenChange,
  warehouse,
  onSuccess,
}: WarehouseDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    if (open) {
      if (warehouse) {
        setFormData({
          name: warehouse.name,
          code: warehouse.code,
          address: warehouse.address || "",
          is_active: warehouse.is_active,
        });
      } else {
        setFormData({
          name: "",
          code: "",
          address: "",
          is_active: true,
        });
      }
    }
  }, [open, warehouse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const warehouseData = {
      name: formData.name,
      code: formData.code,
      address: formData.address || null,
      is_active: formData.is_active,
    };

    if (warehouse) {
      const { error } = await supabase
        .from("warehouses")
        .update(warehouseData)
        .eq("id", warehouse.id);

      if (error) {
        toast.error("Failed to update warehouse");
      } else {
        toast.success("Warehouse updated successfully");
        onSuccess();
      }
    } else {
      const { error } = await supabase
        .from("warehouses")
        .insert([warehouseData]);

      if (error) {
        toast.error("Failed to create warehouse");
      } else {
        toast.success("Warehouse created successfully");
        onSuccess();
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {warehouse ? "Edit Warehouse" : "Add New Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {warehouse
              ? "Update warehouse information"
              : "Create a new warehouse location"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Warehouse Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
                placeholder="e.g., WH001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable this warehouse
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : warehouse ? (
                "Update Warehouse"
              ) : (
                "Create Warehouse"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseDialog;
