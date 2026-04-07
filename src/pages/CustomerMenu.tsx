import { useState } from 'react';
import { UtensilsCrossed, Coffee, Sandwich } from 'lucide-react';
import { useCanteenStore } from '@/store/canteenStore';
import { MenuItemCard } from '@/components/canteen/MenuItemCard';
import { CartSheet } from '@/components/canteen/CartSheet';
import { PaymentDialog } from '@/components/canteen/PaymentDialog';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';

const categories = [
  { key: 'tiffin' as const, label: 'Tiffin', icon: Coffee },
  { key: 'meals' as const, label: 'Meals', icon: UtensilsCrossed },
  { key: 'snacks' as const, label: 'Snacks', icon: Sandwich },
];

export default function CustomerMenu() {
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  const { menu, tableNumber, setTableNumber, getCartTotal, getCartCount } = useCanteenStore();
  const [activeCategory, setActiveCategory] = useState<'tiffin' | 'meals' | 'snacks'>('tiffin');
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  // Set table from QR param
  if (tableParam && Number(tableParam) !== tableNumber) {
    setTableNumber(Number(tableParam));
  }

  const filtered = menu.filter((m) => m.category === activeCategory);
  const total = getCartTotal();
  const count = getCartCount();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-lg">
        <div className="container flex items-center justify-between py-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">SmartServe Canteen</h1>
            <p className="text-xs opacity-80">Dr. B.R. Ambedkar University</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 font-bold">
              Table {tableNumber}
            </Badge>
            <CartSheet onPlaceOrder={(id) => setPaymentOrderId(id)} />
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-[60px] z-20 bg-background border-b border-border">
        <div className="container flex gap-1 py-2 overflow-x-auto">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <main className="container py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-slide-up opacity-0">
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Bar */}
      {count > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-primary text-primary-foreground p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
          <div className="container flex items-center justify-between">
            <div>
              <span className="font-bold text-lg">{count} item{count > 1 ? 's' : ''}</span>
              <span className="mx-2">|</span>
              <span className="font-bold text-lg">₹{total}</span>
            </div>
            <CartSheet onPlaceOrder={(id) => setPaymentOrderId(id)} />
          </div>
        </div>
      )}

      <PaymentDialog
        orderId={paymentOrderId}
        open={!!paymentOrderId}
        onClose={() => setPaymentOrderId(null)}
      />
    </div>
  );
}
