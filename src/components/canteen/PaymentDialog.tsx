import { useState } from 'react';
import { QrCode, Banknote, CheckCircle2 } from 'lucide-react';
import { useCanteenStore } from '@/store/canteenStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function PaymentDialog({
  orderId,
  open,
  onClose,
}: {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const { orders, updatePayment } = useCanteenStore();
  const [paid, setPaid] = useState(false);
  const order = orders.find((o) => o.id === orderId);

  if (!order) return null;

  const handlePay = (method: 'upi' | 'cash') => {
    updatePayment(order.id, method);
    setPaid(true);
    setTimeout(() => {
      setPaid(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {paid ? 'Payment Confirmed!' : 'Complete Payment'}
          </DialogTitle>
        </DialogHeader>

        {paid ? (
          <div className="flex flex-col items-center py-8 animate-bounce-in">
            <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
            <p className="text-xl font-bold">Token #{order.tokenNumber}</p>
            <p className="text-muted-foreground">Your order is being processed</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Token #{order.tokenNumber} • Table {order.tableNumber}</p>
              <p className="text-3xl font-bold text-primary mt-1">₹{order.total}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2 rounded-xl hover:border-primary hover:bg-primary/5"
                onClick={() => handlePay('upi')}
              >
                <QrCode className="h-8 w-8 text-accent" />
                <span className="font-semibold">Scan & Pay</span>
                <span className="text-[10px] text-muted-foreground">UPI QR Code</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2 rounded-xl hover:border-primary hover:bg-primary/5"
                onClick={() => handlePay('cash')}
              >
                <Banknote className="h-8 w-8 text-success" />
                <span className="font-semibold">Cash</span>
                <span className="text-[10px] text-muted-foreground">Pay at Counter</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
