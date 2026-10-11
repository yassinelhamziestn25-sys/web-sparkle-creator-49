import { PageHeader } from "./Layout";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Informations" title={title} />
      <article className="container-lux prose-lux mx-auto max-w-3xl">{children}</article>
    </>
  );
}
