import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Adjustments = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Stock Adjustments</h1>
          <p className="text-muted-foreground">
            Fix stock discrepancies and physical count updates
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Adjustment
        </Button>
      </div>

      <Card className="shadow-premium border-border/50">
        <CardHeader>
          <div className="text-sm text-muted-foreground">
            Stock adjustment management coming soon
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This feature is under development. You'll be able to adjust stock
              quantities based on physical counts here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Adjustments;
