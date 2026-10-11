import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/catalog";
import { genderLabel } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const img = product.product_images[0];
  return (
    <Link to="/produit/$slug" params={{ slug: product.slug }} className="product-card group block">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        {img?.url ? (
          <img src={img.url} alt={img.alt_text ?? product.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-muted-foreground">{product.name}</div>
        )}
      </div>
      <div className="pt-4">
        {product.brand && <p className="eyebrow">{product.brand}</p>}
        <h3 className="mt-1 text-xl">{product.name}</h3>
        {product.gender && <p className="mt-1 text-xs text-muted-foreground">{genderLabel[product.gender]}</p>}
      </div>
    </Link>
  );
}

export function ProductGridSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i}><div className="skeleton aspect-[4/5]" /><div className="skeleton mt-4 h-4 w-2/3" /></div>
      ))}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="border border-border px-6 py-16 text-center">
      <span className="gold-rule mx-auto mb-5" />
      <p className="font-display text-2xl">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
