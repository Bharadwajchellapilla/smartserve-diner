import { useCanteenStore } from '@/store/canteenStore';
import { Bell, ChevronRight } from 'lucide-react';

export default function TokenDisplay() {
  const { orders } = useCanteenStore();

  const readyOrders = orders.filter((o) => o.status === 'ready');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const currentToken = readyOrders[0];
  const nextTokens = [...readyOrders.slice(1), ...preparingOrders].slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="text-center py-6 border-b-2 border-gray-200 bg-gray-50">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">SmartServr Canteen</h1>
        <p className="text-sm font-medium text-gray-500">Dr. B.R. Ambedkar University</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {currentToken ? (
          <div className="text-center animate-fade-in" key={currentToken.id}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Bell className="h-10 w-10 text-amber-500 animate-pulse-soft" />
              <span className="text-2xl font-bold uppercase tracking-[0.3em] text-gray-500">Now Serving</span>
            </div>
            <div
              className="text-[10rem] sm:text-[14rem] font-black leading-none text-green-600 transition-all duration-500"
            >
              #{currentToken.tokenNumber}
            </div>
            <p className="text-2xl font-semibold text-gray-400 mt-4">Table {currentToken.tableNumber}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-5xl font-black text-gray-300">No orders ready</p>
          </div>
        )}

        {nextTokens.length > 0 && (
          <div className="mt-16 w-full max-w-lg">
            <div className="flex items-center gap-2 mb-5 justify-center">
              <ChevronRight className="h-6 w-6 text-gray-400" />
              <span className="text-base uppercase tracking-[0.3em] text-gray-400 font-bold">Up Next</span>
            </div>
            <div className="flex justify-center gap-5 flex-wrap">
              {nextTokens.map((o) => (
                <div
                  key={o.id}
                  className="text-5xl sm:text-6xl font-black text-gray-600 bg-gray-100 px-8 py-4 rounded-2xl border-2 border-gray-200 transition-all duration-300"
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