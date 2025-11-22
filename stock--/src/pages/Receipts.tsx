import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import ReceiptDialog from "@/components/ReceiptDialog";
import { format } from "date-fns";

interface Receipt {
  id: string;
  receipt_number: string;
  supplier_name: string;
  status: string;
  receipt_date: string;
  warehouse_id: string;
  warehouses: { name: string } | null;
}

const Receipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchReceipts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("receipts")
      .select("*, warehouses(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch receipts");
    } else {
      setReceipts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleSuccess = () => {
    fetchReceipts();
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: "badge-draft",
      waiting: "badge-waiting",
      ready: "badge-ready",
      done: "badge-done",
      canceled: "badge-canceled",
    };
    return badges[status] || "badge-draft";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Receipts</h1>
          <p className="text-muted-foreground">
            Manage incoming goods from suppliers
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Receipt
        </Button>
      </div>

      <Card className="shadow-premium border-border/50">
        <CardHeader>
          <div className="text-sm text-muted-foreground">
            Total receipts: {receipts.length}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No receipts yet. Create your first receipt to track incoming
                goods.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-mono text-sm">
                        {receipt.receipt_number}
                      </TableCell>
                      <TableCell className="font-medium">
                        {receipt.supplier_name}
                      </TableCell>
                      <TableCell>{receipt.warehouses?.name || "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(receipt.receipt_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(receipt.status)}
                        >
                          {receipt.status.charAt(0).toUpperCase() +
                            receipt.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ReceiptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Receipts;
