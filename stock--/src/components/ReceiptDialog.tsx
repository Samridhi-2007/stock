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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unit_of_measure: string;
}

interface ReceiptLine {
  product_id: string;
  quantity: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ReceiptDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ReceiptDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<{
    receipt_number: string;
    supplier_name: string;
    warehouse_id: string;
    status: "draft" | "done" | "waiting" | "ready" | "canceled";
  }>({
    receipt_number: "",
    supplier_name: "",
    warehouse_id: "",
    status: "draft",
  });
  const [lines, setLines] = useState<ReceiptLine[]>([
    { product_id: "", quantity: "0" },
  ]);

  useEffect(() => {
    if (open) {
      fetchData();
      generateReceiptNumber();
      setLines([{ product_id: "", quantity: "0" }]);
    }
  }, [open]);

  const fetchData = async () => {
    const [{ data: warehousesData }, { data: productsData }] =
      await Promise.all([
        supabase.from("warehouses").select("*").order("name"),
        supabase.from("products").select("*").order("name"),
      ]);
    setWarehouses(warehousesData || []);
    setProducts(productsData || []);
  };

  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData((prev) => ({ ...prev, receipt_number: `RCP-${timestamp}` }));
  };

  const addLine = () => {
    setLines([...lines, { product_id: "", quantity: "0" }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (
    index: number,
    field: keyof ReceiptLine,
    value: string
  ) => {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();

      // Insert receipt
      const { data: receipt, error: receiptError } = await supabase
        .from("receipts")
        .insert([
          {
            ...formData,
            created_by: user.user?.id,
          },
        ])
        .select()
        .single();

      if (receiptError) throw receiptError;

      // Insert receipt lines
      const receiptLines = lines
        .filter((line) => line.product_id && parseFloat(line.quantity) > 0)
        .map((line) => ({
          receipt_id: receipt.id,
          product_id: line.product_id,
          quantity: parseFloat(line.quantity),
        }));

      if (receiptLines.length > 0) {
        const { error: linesError } = await supabase
          .from("receipt_lines")
          .insert(receiptLines);

        if (linesError) throw linesError;
      }

      // If status is 'done', validate to create stock moves
      if (formData.status === "done") {
        const { error: updateError } = await supabase
          .from("receipts")
          .update({ status: "done" })
          .eq("id", receipt.id);

        if (updateError) throw updateError;
      }

      toast.success("Receipt created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create receipt");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Receipt</DialogTitle>
          <DialogDescription>
            Record incoming goods from your supplier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receipt-number">Receipt Number *</Label>
                <Input
                  id="receipt-number"
                  value={formData.receipt_number}
                  onChange={(e) =>
                    setFormData({ ...formData, receipt_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier_name}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select
                  value={formData.warehouse_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, warehouse_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="done">Done (Validate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Products</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLine}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </div>

              {lines.map((line, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={line.product_id}
                      onValueChange={(value) =>
                        updateLine(index, "product_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) -{" "}
                            {product.unit_of_measure}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
                  Creating...
                </>
              ) : (
                "Create Receipt"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
