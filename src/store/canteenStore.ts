import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'tiffin' | 'meals' | 'snacks';
  isVeg: boolean;
  isPopular?: boolean;
  inStock: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations: string[];
}

export interface Order {
  id: string;
  tokenNumber: number;
  tableNumber: number;
  items: CartItem[];
  total: number;
  status: 'waiting_payment' | 'paid' | 'preparing' | 'ready' | 'collected';
  paymentMethod?: 'upi' | 'cash';
  createdAt: Date;
}

const defaultMenu: MenuItem[] = [
  // Tiffin
  { id: 't1', name: 'Coffee', price: 8, category: 'tiffin', isVeg: true, inStock: true },
  { id: 't2', name: 'Tea', price: 5, category: 'tiffin', isVeg: true, inStock: true },
  { id: 't3', name: 'Milk', price: 7, category: 'tiffin', isVeg: true, inStock: true },
  { id: 't4', name: 'Idli', price: 12, category: 'tiffin', isVeg: true, inStock: true },
  { id: 't5', name: 'Plain Dosa', price: 15, category: 'tiffin', isVeg: true, inStock: true },
  { id: 't6', name: 'Masala Dosa', price: 25, category: 'tiffin', isVeg: true, isPopular: true, inStock: true },
  // Meals
  { id: 'm1', name: 'Plate Meals', price: 40, category: 'meals', isVeg: true, inStock: true },
  { id: 'm2', name: 'Full Meals', price: 55, category: 'meals', isVeg: true, inStock: true },
  { id: 'm3', name: 'Veg Fried Rice', price: 50, category: 'meals', isVeg: true, inStock: true },
  { id: 'm4', name: 'Egg Fried Rice', price: 65, category: 'meals', isVeg: false, inStock: true },
  // Snacks
  { id: 's1', name: 'Samosa', price: 5, category: 'snacks', isVeg: true, inStock: true },
  { id: 's2', name: 'Veg Puff', price: 10, category: 'snacks', isVeg: true, inStock: true },
  { id: 's3', name: 'Egg Puff', price: 20, category: 'snacks', isVeg: false, inStock: true },
  { id: 's4', name: 'Veg Noodles', price: 20, category: 'snacks', isVeg: true, inStock: true },
  { id: 's5', name: 'Chicken Noodles', price: 60, category: 'snacks', isVeg: false, isPopular: true, inStock: true },
];

interface CanteenState {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  tableNumber: number;
  nextToken: number;
  
  // Cart actions
  addToCart: (item: MenuItem, customizations?: string[]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  // Order actions
  placeOrder: () => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePayment: (orderId: string, method: 'upi' | 'cash') => void;
  
  // Menu actions
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  
  // Table
  setTableNumber: (n: number) => void;
}

export const useCanteenStore = create<CanteenState>((set, get) => ({
  menu: defaultMenu,
  cart: [],
  orders: [],
  tableNumber: 3,
  nextToken: 1,

  addToCart: (item, customizations = []) => {
    set((state) => {
      const existing = state.cart.find(
        (c) => c.item.id === item.id && JSON.stringify(c.customizations) === JSON.stringify(customizations)
      );
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.item.id === item.id && JSON.stringify(c.customizations) === JSON.stringify(customizations)
              ? { ...c, quantity: c.quantity + 1 }
              : c
          ),
        };
      }
      return { cart: [...state.cart, { item, quantity: 1, customizations }] };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({ cart: state.cart.filter((c) => c.item.id !== itemId) }));
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      if (quantity <= 0) return { cart: state.cart.filter((c) => c.item.id !== itemId) };
      return {
        cart: state.cart.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)),
      };
    });
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => get().cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0),
  getCartCount: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),

  placeOrder: () => {
    const state = get();
    if (state.cart.length === 0) return null;
    const order: Order = {
      id: crypto.randomUUID(),
      tokenNumber: state.nextToken,
      tableNumber: state.tableNumber,
      items: [...state.cart],
      total: state.getCartTotal(),
      status: 'waiting_payment',
      createdAt: new Date(),
    };
    set({ orders: [...state.orders, order], cart: [], nextToken: state.nextToken + 1 });
    return order;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },

  updatePayment: (orderId, method) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, paymentMethod: method, status: 'paid' as const } : o
      ),
    }));
  },

  updateMenuItem: (id, updates) => {
    set((state) => ({
      menu: state.menu.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },

  addMenuItem: (item) => {
    set((state) => ({
      menu: [...state.menu, { ...item, id: crypto.randomUUID() }],
    }));
  },

  setTableNumber: (n) => set({ tableNumber: n }),
}));
