import { Link } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, Monitor, LayoutDashboard, QrCode } from 'lucide-react';


const modules = [
  { to: '/menu?table=3', label: 'Customer Menu', desc: 'Scan QR & order food', icon: QrCode, color: 'bg-primary' },
  { to: '/chef', label: 'Chef Dashboard', desc: 'Manage incoming orders', icon: ChefHat, color: 'bg-accent' },
  { to: '/admin', label: 'Admin Panel', desc: 'Analytics & stock mgmt', icon: LayoutDashboard, color: 'bg-warning' },
  { to: '/tokens', label: 'Token Display', desc: 'Now serving screen', icon: Monitor, color: 'bg-destructive' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center animate-bounce-in">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 animate-fade-in">SmartServr Canteen</h1>
        <p className="text-xl sm:text-2xl font-bold tracking-wide animate-fade-in bg-warning/90 text-foreground inline-block px-5 py-2 rounded-full mt-2" style={{ animationDelay: '100ms' }}>
          Dr. B.R. Ambedkar University
        </p>
      </div>

      {/* Module Cards */}
      <main className="container py-8 flex-1">
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {modules.map((mod, i) => (
            <Link key={mod.to} to={mod.to} className="block">
              <div
                className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all animate-slide-up opacity-0"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-12 w-12 rounded-xl ${mod.color} flex items-center justify-center mb-4`}>
                  <mod.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="font-bold text-foreground text-lg">{mod.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        College Project • SmartServr v1.0
      </footer>
    </div>
  );
}
