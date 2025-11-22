import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Deliveries = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Deliveries</h1>
          <p className="text-muted-foreground">
            Manage outgoing goods to customers
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Delivery
        </Button>
      </div>

      <Card className="shadow-premium border-border/50">
        <CardHeader>
          <div className="text-sm text-muted-foreground">
            Delivery management coming soon
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This feature is under development. Similar to receipts, you'll be
              able to create and manage deliveries here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deliveries;
