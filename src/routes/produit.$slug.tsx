import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { categoriesQuery, genderLabel, productQuery, productsQuery } from "@/lib/catalog";
import { ProductCard, EmptyState } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produit/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — parfum ELHAMZI` },
      { name: "description", content: "Découvrez ce parfum chez parfum ELHAMZI : notes, famille olfactive et formats." },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — parfum ELHAMZI` },
      { property: "og:description", content: "Parfum disponible chez parfum ELHAMZI, livraison au Maroc." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const q = useQuery(productQuery(slug));
  const all = useQuery(productsQuery());
  const cats = useQuery(categoriesQuery());
  const [active, setActive] = useState(0);

  if (q.isLoading) return <div className="container-lux grid gap-12 py-16 md:grid-cols-2"><div className="skeleton aspect-[4/5]" /><div className="skeleton h-40" /></div>;
  if (!q.data) return (
    <div className="container-lux py-24"><EmptyState title="Parfum introuvable" text="Ce parfum n'existe pas ou n'est plus disponible." />
      <div className="mt-8 text-center"><Link to="/boutique" className="btn-lux">Retour à la boutique</Link></div></div>
  );
  const p = q.data;
  const pCats = (cats.data ?? []).filter((c) => p.product_categories.some((pc) => pc.category_id === c.id));
  const related = (all.data ?? []).filter((o) => o.id !== p.id && o.product_categories.some((pc) => p.product_categories.some((x) => x.category_id === pc.category_id))).slice(0, 4);
  const img = p.product_images[active];

  return (
    <div className="container-lux py-12 md:py-20">
      <nav className="mb-8 text-xs text-muted-foreground" aria-label="Fil d'Ariane"><Link to="/boutique" className="link-lux">Boutique</Link> / {p.name}</nav>
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            {img?.url ? <img src={img.url} alt={img.alt_text ?? p.name} className="h-full w-full object-cover" /> :
              <div className="flex h-full items-center justify-center font-display text-3xl text-muted-foreground">{p.name}</div>}
          </div>
          {p.product_images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {p.product_images.map((im, i) => (
                <button key={im.storage_path} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`} className={`aspect-square overflow-hidden border ${i === active ? "border-gold" : "border-transparent"}`}>
                  {im.url && <img src={im.url} alt={im.alt_text ?? p.name} loading="lazy" className="h-full w-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:pt-6">
          {p.brand && <p className="eyebrow">{p.brand}</p>}
          <h1 className="mt-2 text-5xl">{p.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {pCats.map((c) => <span key={c.id} className="border border-border px-3 py-1">{c.name}</span>)}
            {p.gender && <span className="border border-border px-3 py-1">{genderLabel[p.gender]}</span>}
          </div>
          <span className="gold-rule mt-8" />
          {p.description && <p className="mt-8 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>}
          {p.fragrance_notes && (<><h2 className="mt-10 text-2xl">Notes olfactives</h2><p className="mt-2 whitespace-pre-line text-muted-foreground">{p.fragrance_notes}</p></>)}
          <div className="mt-10 border border-border p-6">
            <p className="eyebrow">Formats</p>
            <p className="mt-2 text-sm text-muted-foreground">Les formats (flacon, décant 5 ml / 10 ml) et les prix seront bientôt disponibles.</p>
            <button className="btn-lux mt-5 w-full" disabled>Ajouter au panier</button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-4xl">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
