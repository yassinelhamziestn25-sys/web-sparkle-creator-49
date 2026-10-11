import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/livraison", label: "Livraison" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="leading-none" aria-label="parfum ELHAMZI — accueil">
      <span className="font-display text-lg italic text-muted-foreground">parfum </span>
      <span className="font-display text-2xl tracking-[0.25em]">ELHAMZI</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-lux flex h-18 items-center justify-between py-4">
        <Logo />
        <nav className="hidden gap-10 text-xs uppercase tracking-[0.2em] md:flex" aria-label="Navigation principale">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="link-lux" activeOptions={{ exact: n.to === "/" }}>{n.label}</Link>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="container-lux flex flex-col gap-5 pb-6 text-sm uppercase tracking-[0.2em] md:hidden">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>)}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-lux grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl"><span className="italic opacity-70">parfum </span><span className="tracking-[0.25em]">ELHAMZI</span></p>
          <p className="mt-4 max-w-sm text-sm opacity-70">Parfums de caractère, flacons complets et décants. Livraison partout au Maroc, paiement à la livraison.</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow !text-gold mb-4">Boutique</p>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/boutique">Tous les parfums</Link></li>
            <li><Link to="/boutique" search={{ format: "decant" }}>Décants</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow !text-gold mb-4">Informations</p>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/livraison">Politique de livraison</Link></li>
            <li><Link to="/conditions">Conditions générales</Link></li>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs opacity-60">© {new Date().getFullYear()} parfum ELHAMZI — Maroc</div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="container-lux pt-16 pb-10 text-center md:pt-24">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 text-4xl md:text-6xl">{title}</h1>
      <span className="gold-rule mx-auto mt-6" />
      {text && <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{text}</p>}
    </div>
  );
}
