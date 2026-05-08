export type Product = {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category: string;
};

export type CartItem = Product & {
  quantity: number;
};
