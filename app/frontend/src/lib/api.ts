import type { Product } from "../types/product";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

type ApiProduct = {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category?: string;
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/api/products`);

  if (!response.ok) {
    throw new Error(`Product API returned ${response.status}`);
  }

  const data = await response.json() as { products: ApiProduct[] };

  return data.products.map(product => ({
    ...product,
    category: product.category || inferCategory(product.name)
  }));
}

export async function getReadiness(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/readyz`);

  if (!response.ok) {
    throw new Error(`Readiness probe returned ${response.status}`);
  }

  return response.json() as Promise<{ status: string }>;
}

function inferCategory(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("hoodie")) return "Apparel";
  if (normalized.includes("bottle")) return "Gear";
  if (normalized.includes("mug")) return "Workspace";
  return "Accessories";
}
