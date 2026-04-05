import { ChefHat, Clock, CheckCircle2, Flame } from 'lucide-react';
import { useCanteenStore } from '@/store/canteenStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ChefDashboard() {
  const { orders, updateOrderStatus } = useCanteenStore();

  const paidOrders = orders.filter((o) => o.status === 'paid' || o.status === 'preparing');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container flex items-center gap-3 py-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Chef Dashboard</h1>
            <p className="text-xs text-muted-foreground">{paidOrders.length} orders in queue</p>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {paidOrders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm">Paid orders will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paidOrders.map((order, i) => (
              <div
                key={order.id}
                className={`rounded-xl border p-5 animate-fade-in transition-all ${
                  i === 0 ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' : 'border-border bg-card shadow-sm'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-primary">#{order.tokenNumber}</span>
                    {i === 0 && <Flame className="h-5 w-5 text-warning animate-pulse-soft" />}
                  </div>
                  <Badge variant={order.status === 'preparing' ? 'default' : 'secondary'}>
                    {order.status === 'preparing' ? 'Preparing' : 'New'}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">Table {order.tableNumber}</p>

                <div className="space-y-1.5 mb-4">
                  {order.items.map((c) => (
                    <div key={c.item.id} className="flex justify-between text-sm">
                      <span>{c.item.name} × {c.quantity}</span>
                      {c.customizations.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">{c.customizations.join(', ')}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {order.status === 'paid' && (
                    <Button className="flex-1 rounded-lg" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                      <Flame className="h-4 w-4 mr-1" /> Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button className="flex-1 rounded-lg bg-accent hover:bg-accent/90" onClick={() => updateOrderStatus(order.id, 'ready')}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Ready
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
