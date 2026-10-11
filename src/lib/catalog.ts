import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = { id: string; name: string; slug: string; description: string | null; sort_order: number };
export type ProductImage = { storage_path: string; alt_text: string | null; sort_order: number; is_primary: boolean; url?: string };
export type Product = {
  id: string; name: string; brand: string | null; slug: string; description: string | null;
  gender: "homme" | "femme" | "mixte" | null; fragrance_notes: string | null;
  featured: boolean; new_arrival: boolean; seo_title: string | null; seo_description: string | null;
  created_at: string;
  product_images: ProductImage[];
  product_categories: { category_id: string }[];
};

const SELECT = "id,name,brand,slug,description,gender,fragrance_notes,featured,new_arrival,seo_title,seo_description,created_at,product_images(storage_path,alt_text,sort_order,is_primary),product_categories(category_id)";

async function withImageUrls(products: Product[]): Promise<Product[]> {
  const paths = products.flatMap((p) => p.product_images.map((i) => i.storage_path));
  if (!paths.length) return products;
  const { data } = await supabase.storage.from("product-images").createSignedUrls(paths, 60 * 60);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return products.map((p) => ({
    ...p,
    product_images: [...p.product_images]
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
      .map((i) => ({ ...i, url: map.get(i.storage_path) ?? undefined })),
  }));
}

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id,name,slug,description,sort_order").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select(SELECT).order("created_at", { ascending: false });
      if (error) throw error;
      return withImageUrls((data ?? []) as unknown as Product[]);
    },
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select(SELECT).eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const [p] = await withImageUrls([data as unknown as Product]);
      return p;
    },
  });

export const genderLabel = { homme: "Homme", femme: "Femme", mixte: "Mixte" } as const;
