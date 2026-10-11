import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard, ProductGridSkeleton, EmptyState } from "@/components/site/ProductCard";
import { PageHeader } from "@/components/site/Layout";

type Search = { q?: string; famille?: string; genre?: string; format?: string; tri?: string; page?: number };
const PER_PAGE = 12;

export const Route = createFileRoute("/boutique")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    famille: typeof s.famille === "string" ? s.famille : undefined,
    genre: typeof s.genre === "string" ? s.genre : undefined,
    format: typeof s.format === "string" ? s.format : undefined,
    tri: typeof s.tri === "string" ? s.tri : undefined,
    page: Number(s.page) > 0 ? Number(s.page) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Boutique — parfum ELHAMZI" },
      { name: "description", content: "Parcourez tous nos parfums : boisés, floraux, orientaux et frais. Flacons et décants." },
      { property: "og:title", content: "Boutique — parfum ELHAMZI" },
      { property: "og:description", content: "Tous nos parfums en flacons complets et décants." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/boutique" });
  const set = (patch: Partial<Search>) => navigate({ search: (prev) => ({ ...prev, ...patch, page: undefined }) });
  const products = useQuery(productsQuery());
  const cats = useQuery(categoriesQuery());

  const filtered = useMemo(() => {
    let list = products.data ?? [];
    const q = s.q?.toLowerCase().trim();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q));
    if (s.famille) {
      const cat = cats.data?.find((c) => c.slug === s.famille);
      list = cat ? list.filter((p) => p.product_categories.some((pc) => pc.category_id === cat.id)) : [];
    }
    if (s.genre) list = list.filter((p) => p.gender === s.genre);
    if (s.tri === "bestsellers") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products.data, cats.data, s]);

  const page = s.page ?? 1;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHeader eyebrow="Boutique" title="Nos parfums" />
      <div className="container-lux">
        <div className="mb-10 grid gap-3 border-y border-border py-5 md:grid-cols-5">
          <input className="input-lux md:col-span-2" placeholder="Rechercher un parfum ou une marque" aria-label="Recherche"
            defaultValue={s.q} onChange={(e) => set({ q: e.target.value || undefined })} />
          <select className="input-lux" aria-label="Famille" value={s.famille ?? ""} onChange={(e) => set({ famille: e.target.value || undefined })}>
            <option value="">Toutes les familles</option>
            {cats.data?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select className="input-lux" aria-label="Genre" value={s.genre ?? ""} onChange={(e) => set({ genre: e.target.value || undefined })}>
            <option value="">Tous genres</option><option value="homme">Homme</option><option value="femme">Femme</option><option value="mixte">Mixte</option>
          </select>
          <select className="input-lux" aria-label="Trier" value={s.tri ?? ""} onChange={(e) => set({ tri: e.target.value || undefined })}>
            <option value="">Nouveautés</option><option value="bestsellers">Meilleures ventes</option>
          </select>
        </div>
        <p className="mb-8 text-xs text-muted-foreground">
          Les filtres par prix, format (flacon / décant) et disponibilité seront actifs dès que les formats et prix seront configurés.
        </p>
        {products.isLoading ? <ProductGridSkeleton n={8} /> :
          products.isError ? <EmptyState title="Impossible de charger les parfums" text="Veuillez réessayer." /> :
          shown.length === 0 ? <EmptyState title="Aucun parfum disponible pour le moment" text={(products.data?.length ?? 0) > 0 ? "Aucun résultat pour ces critères." : "Notre sélection arrive très bientôt."} /> : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        {pages > 1 && (
          <nav className="mt-14 flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => navigate({ search: (prev) => ({ ...prev, page: i + 1 }) })}
                className={i + 1 === page ? "btn-lux !px-4 !py-2" : "btn-outline-lux !px-4 !py-2"}>{i + 1}</button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
