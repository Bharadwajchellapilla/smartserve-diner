import { useState } from 'react';
import { BarChart3, PieChart as PieIcon, Package, TrendingUp, ShoppingBag, DollarSign, Lock } from 'lucide-react';
import { useCanteenStore } from '@/store/canteenStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ADMIN_PASS = 'admin123';
const COLORS = ['hsl(134,61%,41%)', 'hsl(211,100%,50%)', 'hsl(45,93%,47%)', 'hsl(0,84%,60%)', 'hsl(280,60%,50%)'];

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { orders, menu, updateMenuItem } = useCanteenStore();

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm animate-scale-in">
          <CardHeader className="text-center">
            <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button className="w-full" onClick={handleLogin}>Login</Button>
            <p className="text-[10px] text-center text-muted-foreground">Demo password: admin123</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.filter((o) => o.status !== 'waiting_payment').reduce((s, o) => s + o.total, 0);

  // Most sold item
  const itemCounts: Record<string, number> = {};
  orders.forEach((o) => o.items.forEach((c) => { itemCounts[c.item.name] = (itemCounts[c.item.name] || 0) + c.quantity; }));
  const mostSold = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];

  // Chart data
  const pieData = Object.entries(itemCounts).slice(0, 5).map(([name, value]) => ({ name, value }));
  const barData = [
    { day: 'Mon', sales: Math.floor(Math.random() * 2000) + 500 },
    { day: 'Tue', sales: Math.floor(Math.random() * 2000) + 500 },
    { day: 'Wed', sales: Math.floor(Math.random() * 2000) + 500 },
    { day: 'Thu', sales: totalRevenue || Math.floor(Math.random() * 2000) + 500 },
    { day: 'Fri', sales: Math.floor(Math.random() * 2000) + 500 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">SmartServr Canteen</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAuthenticated(false)}>Logout</Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-primary' },
            { label: 'Revenue', value: `₹${totalRevenue}`, icon: DollarSign, color: 'text-accent' },
            { label: 'Most Sold', value: mostSold?.[0] || '-', icon: TrendingUp, color: 'text-warning' },
            { label: 'Menu Items', value: menu.length, icon: Package, color: 'text-destructive' },
          ].map((stat) => (
            <Card key={stat.label} className="animate-fade-in">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 opacity-20 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Daily Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <PieIcon className="h-4 w-4" /> Item Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stock Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Menu & Stock Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menu.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${item.isVeg ? 'text-primary' : 'text-destructive'}`}>●</span>
                    <span className="font-medium text-sm">{item.name}</span>
                    <Badge variant="outline" className="text-[10px]">₹{item.price}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.inStock ? 'In Stock' : 'Out'}</span>
                    <Switch
                      checked={item.inStock}
                      onCheckedChange={(v) => updateMenuItem(item.id, { inStock: v })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
