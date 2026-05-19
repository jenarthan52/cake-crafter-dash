import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "customer" | "admin" | "baker";

export type OrderStatus = "Pending" | "Baking" | "Out for Delivery" | "Delivered";

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  stock: number;
  veg: boolean;
  eggless: boolean;
  bestSeller: boolean;
  image: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  custom?: {
    photo?: string;
    text?: string;
    flavor?: string;
    weight?: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  paymentStatus: "Paid" | "Pending";
  status: OrderStatus;
  createdAt: number;
}

interface State {
  role: Role;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  setRole: (r: Role) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seedCategories: Category[] = [
  { id: "c1", name: "Wedding Cakes" },
  { id: "c2", name: "Birthday Cakes" },
  { id: "c3", name: "Theme Cakes" },
  { id: "c4", name: "Breads & Buns" },
  { id: "c5", name: "Cookies & Biscuits" },
  { id: "c6", name: "Pastries" },
  { id: "c7", name: "Donuts" },
  { id: "c8", name: "Evening Snacks" },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

const seedProducts: Product[] = [
  { id: "p1", name: "Classic Tiered Wedding Cake", description: "Three-tier vanilla sponge with rose buttercream and edible gold leaf.", categoryId: "c1", price: 7500, salePrice: 6999, stock: 5, veg: true, eggless: false, bestSeller: true, image: img("photo-1622896784083-cc051313dbab") },
  { id: "p2", name: "Chocolate Truffle Birthday Cake", description: "Rich Belgian chocolate truffle with ganache drip.", categoryId: "c2", price: 899, salePrice: 749, stock: 18, veg: true, eggless: false, bestSeller: true, image: img("photo-1578985545062-69928b1d9587") },
  { id: "p3", name: "Unicorn Theme Cake", description: "Pastel buttercream unicorn cake — kids' favourite.", categoryId: "c3", price: 1499, stock: 8, veg: true, eggless: true, bestSeller: false, image: img("photo-1535141192574-5d4897c12636") },
  { id: "p4", name: "Sourdough Country Loaf", description: "24-hour fermented artisan sourdough.", categoryId: "c4", price: 220, stock: 24, veg: true, eggless: true, bestSeller: false, image: img("photo-1509440159596-0249088772ff") },
  { id: "p5", name: "Butter Cookies Tin", description: "Melt-in-mouth Danish-style butter cookies.", categoryId: "c5", price: 349, salePrice: 299, stock: 40, veg: true, eggless: false, bestSeller: true, image: img("photo-1499636136210-6f4ee915583e") },
  { id: "p6", name: "Almond Croissant", description: "Flaky French croissant filled with almond cream.", categoryId: "c6", price: 120, stock: 30, veg: true, eggless: false, bestSeller: true, image: img("photo-1555507036-ab1f4038808a") },
  { id: "p7", name: "Glazed Donuts (Box of 6)", description: "Pillow-soft donuts with classic sugar glaze.", categoryId: "c7", price: 299, stock: 22, veg: true, eggless: false, bestSeller: false, image: img("photo-1551024601-bec78aea704b") },
  { id: "p8", name: "Veg Puff Pastry", description: "Crisp puff stuffed with spicy mixed veg.", categoryId: "c8", price: 45, stock: 60, veg: true, eggless: true, bestSeller: false, image: img("photo-1601000938259-9e92002320b2") },
  { id: "p9", name: "Red Velvet Cake", description: "Classic red velvet with cream cheese frosting.", categoryId: "c2", price: 999, stock: 12, veg: true, eggless: true, bestSeller: true, image: img("photo-1586788680434-30d324b2d46f") },
  { id: "p10", name: "Multigrain Bread", description: "Healthy seeded multigrain loaf.", categoryId: "c4", price: 180, stock: 20, veg: true, eggless: true, bestSeller: false, image: img("photo-1568471173242-461f0a730452") },
];

const seedOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Aarav Sharma",
    phone: "9876543210",
    address: "12 Park Lane, Mumbai",
    items: [{ id: "i1", productId: "p2", name: "Chocolate Truffle Birthday Cake", price: 749, qty: 1, image: seedProducts[1].image }],
    total: 749,
    paymentStatus: "Paid",
    status: "Baking",
    createdAt: Date.now() - 3600_000,
  },
  {
    id: "ORD-1002",
    customerName: "Priya Kapoor",
    phone: "9123456780",
    address: "Sector 18, Noida",
    items: [{ id: "i2", name: "Custom Photo Cake", price: 1800, qty: 1, image: seedProducts[2].image, custom: { text: "Happy Birthday Papa", flavor: "Red Velvet", weight: "1kg" } }],
    total: 1800,
    paymentStatus: "Pending",
    status: "Pending",
    createdAt: Date.now() - 1800_000,
  },
  {
    id: "ORD-1003",
    customerName: "Rohan Mehta",
    phone: "9988776655",
    address: "Banjara Hills, Hyderabad",
    items: [{ id: "i3", productId: "p6", name: "Almond Croissant", price: 120, qty: 4, image: seedProducts[5].image }],
    total: 480,
    paymentStatus: "Paid",
    status: "Out for Delivery",
    createdAt: Date.now() - 7200_000,
  },
];

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      role: "customer",
      categories: seedCategories,
      products: seedProducts,
      cart: [],
      orders: seedOrders,
      setRole: (role) => set({ role }),
      addCategory: (name) =>
        set((s) => ({ categories: [...s.categories, { id: uid(), name }] })),
      updateCategory: (id, name) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      addProduct: (p) => set((s) => ({ products: [{ ...p, id: uid() }, ...s.products] })),
      updateProduct: (id, p) =>
        set((s) => ({ products: s.products.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
      addToCart: (item) =>
        set((s) => {
          if (item.productId) {
            const existing = s.cart.find((c) => c.productId === item.productId && !c.custom);
            if (existing) {
              return { cart: s.cart.map((c) => (c.id === existing.id ? { ...c, qty: c.qty + item.qty } : c)) };
            }
          }
          return { cart: [...s.cart, { ...item, id: uid() }] };
        }),
      updateCartQty: (id, qty) =>
        set((s) => ({ cart: s.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c)) })),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      clearCart: () => set({ cart: [] }),
      placeOrder: (o) => {
        const order: Order = {
          ...o,
          id: `ORD-${1000 + get().orders.length + 1}`,
          createdAt: Date.now(),
          status: "Pending",
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [] }));
        return order;
      },
      updateOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
    }),
    { name: "sweet-treat-bakery" },
  ),
);