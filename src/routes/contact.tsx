import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — parfum ELHAMZI" },
      { name: "description", content: "Contactez parfum ELHAMZI pour un conseil ou une question sur votre commande." },
      { property: "og:title", content: "Contact — parfum ELHAMZI" },
      { property: "og:description", content: "Une question ? Écrivez-nous." },
    ],
  }),
  component: Contact,
});

const phoneRe = /^(\+212|00212|0)[5-7]\d{8}$/;
const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  phone: z.string().trim().max(20).refine((v) => !v || phoneRe.test(v.replace(/\s/g, "")), "Numéro marocain invalide"),
  email: z.string().trim().max(255).refine((v) => !v || z.string().email().safeParse(v).success, "Email invalide"),
  message: z.string().trim().min(5, "Message trop court").max(2000),
});

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const r = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({}); setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name: r.data.name, phone: r.data.phone.replace(/\s/g, "") || null, email: r.data.email || null, message: r.data.message,
    });
    if (error) { setStatus("error"); return; }
    setStatus("sent"); form.reset();
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block">{label}</label>
      <input id={name} name={name} className="input-lux" aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="Contact" title="Écrivez-nous" text="Conseil, question sur un parfum ou une commande : nous vous répondons au plus vite." />
      <form onSubmit={onSubmit} noValidate className="container-lux mx-auto grid max-w-2xl gap-6">
        {field("name", "Nom complet *", { autoComplete: "name" })}
        <div className="grid gap-6 md:grid-cols-2">
          {field("phone", "Téléphone", { type: "tel", placeholder: "+212 6XX XX XX XX", autoComplete: "tel" })}
          {field("email", "Email", { type: "email", autoComplete: "email" })}
        </div>
        <div>
          <label htmlFor="message" className="eyebrow mb-2 block">Message *</label>
          <textarea id="message" name="message" rows={6} className="input-lux" aria-invalid={!!errors.message} />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>
        <button className="btn-lux" disabled={status === "sending"}>{status === "sending" ? "Envoi…" : "Envoyer"}</button>
        {status === "sent" && <p role="status" className="text-center text-sm">Merci, votre message a bien été envoyé.</p>}
        {status === "error" && <p role="alert" className="text-center text-sm text-destructive">L'envoi a échoué. Veuillez réessayer.</p>}
      </form>
    </>
  );
}
