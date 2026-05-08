import { useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types/product";

const storageKey = "cloudcart-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) as CartItem[] : [];
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const add = (product: Product) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setOpen(true);
  };

  const remove = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.quantity * item.price, 0), [items]);

  return {
    items,
    open,
    count,
    subtotal,
    add,
    remove,
    clear,
    setOpen
  };
}
