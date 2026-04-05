import { useState } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { MenuItem, useCanteenStore } from '@/store/canteenStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const customizationOptions = ['Less Sugar', 'Extra Hot', 'Extra Spicy'];

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart, cart, updateQuantity } = useCanteenStore();
  const [showCustom, setShowCustom] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const cartItem = cart.find((c) => c.item.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addToCart(item, selected);
    setShowCustom(false);
    setSelected([]);
  };

  const toggle = (opt: string) =>
    setSelected((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]));

  if (!item.inStock) return null;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold border rounded px-1 ${item.isVeg ? 'text-primary border-primary' : 'text-destructive border-destructive'}`}>
              {item.isVeg ? '●' : '●'}
            </span>
            <h3 className="font-semibold text-card-foreground truncate">{item.name}</h3>
            {item.isPopular && (
              <Badge variant="secondary" className="text-[10px] gap-0.5 bg-warning/15 text-warning border-0 shrink-0">
                <Star className="h-2.5 w-2.5 fill-current" /> Popular
              </Badge>
            )}
          </div>
          <p className="text-lg font-bold text-primary">₹{item.price}</p>
        </div>

        <div className="shrink-0">
          {qty === 0 ? (
            <Button
              size="sm"
              className="rounded-lg font-semibold px-5"
              onClick={() => setShowCustom(true)}
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary hover:bg-primary/20"
                onClick={() => updateQuantity(item.id, qty - 1)}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="font-bold text-primary w-5 text-center">{qty}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary hover:bg-primary/20"
                onClick={() => addToCart(item)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {showCustom && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in">
          <p className="text-xs font-medium text-muted-foreground mb-2">Customizations</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {customizationOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={() => toggle(opt)}
                  className="h-3.5 w-3.5"
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="rounded-lg text-xs">
              Add to Cart
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowCustom(false)} className="text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
