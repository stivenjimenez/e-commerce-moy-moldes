import useSWR from "swr";

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: "mujer" | "hombre" | "infantil";
  subcategory: string;
  fabric: "plano" | "punto";
  featured: boolean;
  badge: string | null;
}

export interface UseProductsParams {
  featured?: boolean;
  category?: "mujer" | "hombre" | "infantil";
  subcategory?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Pass null to disable fetching (when data is provided externally)
export function useProducts(params?: UseProductsParams | null) {
  const disabled = params === null;

  const searchParams = new URLSearchParams();
  if (!disabled) {
    if (params?.featured) searchParams.set("featured", "true");
    if (params?.category) searchParams.set("category", params.category);
    if (params?.subcategory) searchParams.set("subcategory", params.subcategory);
  }

  const query = searchParams.toString();
  const url = disabled ? null : `/api/products${query ? `?${query}` : ""}`;

  const { data, error, isLoading } = useSWR<Product[]>(url, fetcher);

  return {
    products: data ?? [],
    isLoading: disabled ? false : isLoading,
    isError: disabled ? false : !!error,
  };
}
