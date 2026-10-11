import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Truck, HandCoins, MessageCircle, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import decants from "@/assets/decants.jpg";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard, ProductGridSkeleton, EmptyState } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "parfum ELHAMZI — Parfums de luxe & décants au Maroc" },
      { name: "description", content: "Découvrez nos parfums de luxe en flacons et décants 5 ml / 10 ml. Livraison au Maroc, paiement à la livraison." },
      { property: "og:title", content: "parfum ELHAMZI — Parfums de luxe & décants" },
      { property: "og:description", content: "Flacons complets et décants 5 ml / 10 ml, livrés partout au Maroc." },
    ],
  }),
  component: Home,
});

function Section({ eyebrow, title, children, action }: { eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="container-lux py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-4xl md:text-5xl">{title}</h2></div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Home() {
  const products = useQuery(productsQuery());
  const cats = useQuery(categoriesQuery());
  const list = products.data ?? [];
  const featured = list.filter((p) => p.featured).slice(0, 4);
  const arrivals = list.filter((p) => p.new_arrival).slice(0, 4);

  const grid = (items: typeof list, empty: string) =>
    products.isLoading ? <ProductGridSkeleton /> :
    products.isError ? <EmptyState title="Impossible de charger les parfums" text="Veuillez réessayer dans un instant." /> :
    items.length === 0 ? <EmptyState title={empty} text="Notre sélection arrive très bientôt." /> :
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>;

  return (
    <>
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <img src={hero} alt="Flacon de parfum doré sur pierre de travertin" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="container-lux relative flex h-full flex-col justify-end pb-20 text-primary-foreground fade-up">
          <p className="eyebrow !text-primary-foreground/80">Parfumerie — Maroc</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl">L'art du parfum, <em>flacon après flacon.</em></h1>
          <p className="mt-6 max-w-lg text-primary-foreground/85">Des fragrances d'exception en flacons complets ou en décants, pour découvrir avant d'adopter.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/boutique" className="btn-ghost-ivory">Découvrir nos parfums</Link>
            <Link to="/boutique" search={{ format: "decant" }} className="btn-ghost-ivory">Explorer les décants</Link>
          </div>
        </div>
      </section>

      <Section eyebrow="Sélection" title="Meilleures ventes" action={<Link to="/boutique" className="link-lux text-xs uppercase tracking-[0.2em]">Tout voir</Link>}>
        {grid(featured, "Aucun parfum disponible pour le moment")}
      </Section>

      <Section eyebrow="Familles olfactives" title="Nos catégories">
        {cats.isLoading ? <ProductGridSkeleton /> : (
          <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
            {(cats.data ?? []).map((c) => (
              <Link key={c.id} to="/boutique" search={{ famille: c.slug }} className="group bg-background p-8 transition-colors hover:bg-secondary">
                <h3 className="text-3xl">{c.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-6 block text-xs uppercase tracking-[0.2em] text-gold">Explorer →</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Nouveautés" title="Nouveaux arrivages">
        {grid(arrivals, "Aucune nouveauté pour le moment")}
      </Section>

      <section className="bg-secondary">
        <div className="container-lux grid items-center gap-12 py-20 md:grid-cols-2">
          <img src={decants} alt="Décants de parfum 5 ml et 10 ml" loading="lazy" width={1200} height={912} className="w-full" />
          <div>
            <p className="eyebrow">Décants</p>
            <h2 className="mt-2 text-4xl md:text-5xl">5 ml & 10 ml</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 text-muted-foreground">Essayez un parfum pendant plusieurs jours avant d'investir dans un flacon complet. Nos décants sont prélevés directement des flacons originaux.</p>
            <Link to="/boutique" search={{ format: "decant" }} className="btn-lux mt-8">Explorer les décants</Link>
          </div>
        </div>
      </section>

      <section className="container-lux grid gap-10 py-20 sm:grid-cols-2 md:grid-cols-4">
        {[
          { i: Truck, t: "Livraison au Maroc", d: "Expédition vers les villes desservies." },
          { i: HandCoins, t: "Paiement à la livraison", d: "Vous payez à la réception de votre colis." },
          { i: ShieldCheck, t: "Produits authentiques", d: "Flacons originaux et décants soignés." },
          { i: MessageCircle, t: "Service client", d: "Une question ? Écrivez-nous." },
        ].map(({ i: Icon, t, d }) => (
          <div key={t} className="text-center">
            <Icon className="mx-auto text-gold" strokeWidth={1.2} size={30} />
            <h3 className="mt-4 text-xl">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="container-lux">
        <div className="border border-border p-10 text-center md:p-16">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-2 text-4xl">Besoin d'un conseil ?</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">Nous vous aidons à trouver la fragrance qui vous ressemble.</p>
          <Link to="/contact" className="btn-outline-lux mt-8">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
