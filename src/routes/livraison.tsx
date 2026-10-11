import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/livraison")({
  head: () => ({
    meta: [
      { title: "Politique de livraison — parfum ELHAMZI" },
      { name: "description", content: "Livraison au Maroc et paiement à la livraison chez parfum ELHAMZI." },
      { property: "og:title", content: "Politique de livraison — parfum ELHAMZI" },
      { property: "og:description", content: "Comment se déroule la livraison de vos parfums au Maroc." },
    ],
  }),
  component: () => (
    <LegalPage title="Politique de livraison">
      <h2>Zones desservies</h2>
      <p>Nous livrons dans les villes du Maroc affichées lors de la commande. Les frais de livraison dépendent de la ville et sont indiqués clairement avant la validation.</p>
      <h2>Paiement</h2>
      <p>Le paiement s'effectue en espèces à la livraison (Cash on Delivery), à la réception du colis.</p>
      <h2>Confirmation</h2>
      <p>Après votre commande, notre équipe peut vous contacter par téléphone pour confirmer l'adresse et la disponibilité.</p>
      <h2>Réception</h2>
      <p>Merci de vérifier l'état du colis à la réception. En cas de problème, contactez-nous rapidement.</p>
    </LegalPage>
  ),
});
