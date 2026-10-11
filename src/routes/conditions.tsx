import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — parfum ELHAMZI" },
      { name: "description", content: "Conditions générales de vente de parfum ELHAMZI." },
      { property: "og:title", content: "Conditions générales — parfum ELHAMZI" },
      { property: "og:description", content: "Les conditions applicables à vos commandes." },
    ],
  }),
  component: () => (
    <LegalPage title="Conditions générales">
      <h2>Objet</h2>
      <p>Les présentes conditions régissent les ventes de parfums (flacons et décants) réalisées sur ce site auprès de clients situés au Maroc.</p>
      <h2>Prix</h2>
      <p>Les prix sont indiqués en dirhams marocains (MAD) toutes taxes comprises. Les frais de livraison s'ajoutent selon la ville choisie.</p>
      <h2>Commande</h2>
      <p>Toute commande vaut acceptation des présentes conditions. Elle est confirmée sous réserve de disponibilité.</p>
      <h2>Décants</h2>
      <p>Les décants sont des échantillons prélevés de flacons originaux, conditionnés dans des vaporisateurs dédiés.</p>
      <h2>Paiement</h2>
      <p>Le paiement s'effectue à la livraison.</p>
    </LegalPage>
  ),
});
