import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { format } from "date-fns";

interface StockMove {
  id: string;
  product_id: string;
  warehouse_id: string;
  move_type: string;
  reference_number: string | null;
  quantity: number;
  move_date: string;
  notes: string | null;
  products: { name: string; sku: string } | null;
  warehouses: { name: string } | null;
}

const History = () => {
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStockMoves();
  }, []);

  const fetchStockMoves = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("stock_moves")
      .select("*, products(name, sku), warehouses(name)")
      .order("move_date", { ascending: false })
      .limit(100);

    if (!error) {
      setMoves(data || []);
    }
    setIsLoading(false);
  };

  const getMoveTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      receipt: { label: "Receipt", className: "badge-done" },
      delivery: { label: "Delivery", className: "badge-waiting" },
      transfer: { label: "Transfer", className: "badge-ready" },
      adjustment: { label: "Adjustment", className: "badge-draft" },
    };
    return badges[type] || { label: type, className: "badge-draft" };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold">Move History</h1>
        <p className="text-muted-foreground">
          Complete ledger of all stock movements
        </p>
      </div>

      <Card className="shadow-premium border-border/50">
        <CardHeader>
          <div className="text-sm text-muted-foreground">
            Showing last 100 movements
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                Loading stock moves...
              </p>
            </div>
          ) : moves.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No stock movements yet. Process receipts or deliveries to see
                history.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moves.map((move) => {
                    const badge = getMoveTypeBadge(move.move_type);
                    return (
                      <TableRow key={move.id}>
                        <TableCell className="font-mono text-sm">
                          {format(
                            new Date(move.move_date),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {move.products?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {move.products?.sku}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{move.warehouses?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={badge.className}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {move.reference_number || "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span
                            className={
                              move.quantity > 0
                                ? "text-success"
                                : "text-destructive"
                            }
                          >
                            {move.quantity > 0 ? "+" : ""}
                            {move.quantity.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
