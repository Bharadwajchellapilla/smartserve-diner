import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCanteenStore } from '@/store/canteenStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function CartSheet({ onPlaceOrder }: { onPlaceOrder: (orderId: string) => void }) {
  const { cart, getCartTotal, getCartCount, updateQuantity, removeFromCart, placeOrder } = useCanteenStore();
  const [open, setOpen] = useState(false);

  const handlePlace = () => {
    const order = placeOrder();
    if (order) {
      setOpen(false);
      onPlaceOrder(order.id);
    }
  };

  const count = getCartCount();
  const total = getCartTotal();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-bounce-in">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({count} items)</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {cart.map((c) => (
                <div key={c.item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 animate-fade-in">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.item.name}</p>
                    {c.customizations.length > 0 && (
                      <p className="text-[10px] text-muted-foreground">{c.customizations.join(', ')}</p>
                    )}
                    <p className="text-sm font-bold text-primary">₹{c.item.price * c.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(c.item.id, c.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-semibold text-sm">{c.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(c.item.id, c.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(c.item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
              <Button className="w-full h-12 text-base font-semibold rounded-xl" onClick={handlePlace}>
                Place Order
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
