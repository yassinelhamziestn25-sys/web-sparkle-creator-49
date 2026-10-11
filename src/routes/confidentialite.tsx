import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — parfum ELHAMZI" },
      { name: "description", content: "Comment parfum ELHAMZI protège vos données personnelles." },
      { property: "og:title", content: "Confidentialité — parfum ELHAMZI" },
      { property: "og:description", content: "Protection de vos données personnelles." },
    ],
  }),
  component: () => (
    <LegalPage title="Confidentialité">
      <h2>Données collectées</h2>
      <p>Nous collectons uniquement les informations nécessaires au traitement de vos commandes et de vos messages : nom, téléphone, adresse de livraison et, le cas échéant, email.</p>
      <h2>Utilisation</h2>
      <p>Ces données servent exclusivement à la livraison, au suivi de commande et au service client. Elles ne sont jamais revendues.</p>
      <h2>Vos droits</h2>
      <p>Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition. Contactez-nous via la page Contact.</p>
    </LegalPage>
  ),
});
