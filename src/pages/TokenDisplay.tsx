import { useCanteenStore } from '@/store/canteenStore';
import { Bell, ChevronRight } from 'lucide-react';

export default function TokenDisplay() {
  const { orders } = useCanteenStore();

  const readyOrders = orders.filter((o) => o.status === 'ready');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const currentToken = readyOrders[0];
  const nextTokens = [...readyOrders.slice(1), ...preparingOrders].slice(0, 4);

  return (
    <div className="min-h-screen bg-foreground text-primary-foreground flex flex-col">
      <header className="text-center py-6 border-b border-muted-foreground/20">
        <h1 className="text-2xl font-bold tracking-tight">SmartServr Canteen</h1>
        <p className="text-sm opacity-60">Dr. B.R. Ambedkar University</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {currentToken ? (
          <div className="text-center animate-bounce-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bell className="h-8 w-8 text-warning animate-pulse-soft" />
              <span className="text-xl font-medium uppercase tracking-widest opacity-60">Now Serving</span>
            </div>
            <div className="text-[8rem] sm:text-[12rem] font-black leading-none text-primary drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
              #{currentToken.tokenNumber}
            </div>
            <p className="text-lg opacity-50 mt-2">Table {currentToken.tableNumber}</p>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <p className="text-4xl font-bold">No orders ready</p>
          </div>
        )}

        {nextTokens.length > 0 && (
          <div className="mt-16 w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <ChevronRight className="h-5 w-5 opacity-40" />
              <span className="text-sm uppercase tracking-widest opacity-40 font-medium">Up Next</span>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {nextTokens.map((o) => (
                <div
                  key={o.id}
                  className="text-4xl sm:text-5xl font-black opacity-40 bg-muted-foreground/10 px-6 py-3 rounded-2xl"
                >
                  #{o.tokenNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
